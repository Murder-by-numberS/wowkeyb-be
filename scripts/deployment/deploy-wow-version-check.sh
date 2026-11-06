#!/bin/bash
# Deploy the retail WoW version checker.
# Tuesday 8:00 PM America/New_York is after a long patch-day maintenance window.
# Wednesday 10:00 AM America/New_York catches a maintenance that runs overnight.
set -euo pipefail

REGION="${AWS_REGION:-us-east-1}"
FUNCTION_NAME="wowkeyb-wow-version-check"
ROLE_NAME="wowkeyb-wow-version-check"
SCHEDULER_ROLE_NAME="wowkeyb-wow-version-check-scheduler"
PARAMETER_NAME="/wowkeyb-be/production/DATABASE_URI"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="$(mktemp -d)"
ZIP="$WORK/function.zip"

cleanup() {
  rm -rf "$WORK"
}
trap cleanup EXIT

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
FUNCTION_ARN="arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
SCHEDULER_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${SCHEDULER_ROLE_NAME}"

echo "Packaging ${FUNCTION_NAME}..."
mkdir -p "$WORK/pkg/src/jobs" "$WORK/pkg/src/lambda" "$WORK/pkg/src/models" "$WORK/pkg/src/utils"
cp "$ROOT/src/jobs/retailWowVersion.js" "$ROOT/src/jobs/retailAbilities.js" "$WORK/pkg/src/jobs/"
cp "$ROOT/src/lambda/wowVersionCheck.js" "$ROOT/src/lambda/wowAbilityCheck.js" "$WORK/pkg/src/lambda/"
cp "$ROOT/src/models/version.js" "$ROOT/src/models/ability.js" "$WORK/pkg/src/models/"
cp "$ROOT/src/utils/class-spec-hero-catalog.js" "$WORK/pkg/src/utils/"
cat > "$WORK/pkg/package.json" <<'EOF'
{
  "name": "wowkeyb-wow-version-check",
  "private": true,
  "type": "module",
  "dependencies": {
    "@aws-sdk/client-ssm": "^3.916.0",
    "mongoose": "^8.1.1"
  }
}
EOF
npm install --omit=dev --prefix "$WORK/pkg"
(
  cd "$WORK/pkg"
  zip -qr "$ZIP" package.json node_modules src
)

if ! aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": { "Service": "lambda.amazonaws.com" },
        "Action": "sts:AssumeRole"
      }]
    }' >/dev/null
fi

aws iam attach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" >/dev/null || true

aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "ReadDatabaseUri" \
  --policy-document "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [
      {
        \"Effect\": \"Allow\",
        \"Action\": [\"ssm:GetParameter\"],
        \"Resource\": \"arn:aws:ssm:${REGION}:${ACCOUNT_ID}:parameter/wowkeyb-be/production/DATABASE_URI\"
      },
      {
        \"Effect\": \"Allow\",
        \"Action\": [\"kms:Decrypt\"],
        \"Resource\": \"*\",
        \"Condition\": {
          \"StringEquals\": { \"kms:ViaService\": \"ssm.${REGION}.amazonaws.com\" }
        }
      }
    ]
  }" >/dev/null

upsert_lambda() {
  local name="$1"
  local handler="$2"
  if aws lambda get-function --function-name "$name" --region "$REGION" >/dev/null 2>&1; then
    aws lambda update-function-code \
      --function-name "$name" \
      --region "$REGION" \
      --zip-file "fileb://${ZIP}" >/dev/null
    aws lambda wait function-updated --function-name "$name" --region "$REGION"
    aws lambda update-function-configuration \
      --function-name "$name" \
      --region "$REGION" \
      --runtime nodejs22.x \
      --handler "$handler" \
      --timeout 120 \
      --memory-size 512 \
      --environment "Variables={DATABASE_URI_PARAMETER=${PARAMETER_NAME}}" >/dev/null
  else
    sleep 10
    aws lambda create-function \
      --function-name "$name" \
      --region "$REGION" \
      --runtime nodejs22.x \
      --role "$ROLE_ARN" \
      --handler "$handler" \
      --timeout 120 \
      --memory-size 512 \
      --zip-file "fileb://${ZIP}" \
      --environment "Variables={DATABASE_URI_PARAMETER=${PARAMETER_NAME}}" >/dev/null
  fi
  aws lambda wait function-updated --function-name "$name" --region "$REGION" || \
    aws lambda wait function-active --function-name "$name" --region "$REGION"
}

upsert_lambda "$FUNCTION_NAME" "src/lambda/wowVersionCheck.handler"
ABILITY_FUNCTION_NAME="wowkeyb-wow-ability-check"
ABILITY_FUNCTION_ARN="arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${ABILITY_FUNCTION_NAME}"
upsert_lambda "$ABILITY_FUNCTION_NAME" "src/lambda/wowAbilityCheck.handler"

SCHEDULER_TRUST='{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "scheduler.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}'

if ! aws iam get-role --role-name "$SCHEDULER_ROLE_NAME" >/dev/null 2>&1; then
  aws iam create-role \
    --role-name "$SCHEDULER_ROLE_NAME" \
    --assume-role-policy-document "$SCHEDULER_TRUST" >/dev/null
else
  aws iam update-assume-role-policy \
    --role-name "$SCHEDULER_ROLE_NAME" \
    --policy-document "$SCHEDULER_TRUST" >/dev/null
fi

aws iam put-role-policy \
  --role-name "$SCHEDULER_ROLE_NAME" \
  --policy-name "InvokeVersionCheck" \
  --policy-document "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [{
      \"Effect\": \"Allow\",
      \"Action\": \"lambda:InvokeFunction\",
      \"Resource\": [\"${FUNCTION_ARN}\", \"${ABILITY_FUNCTION_ARN}\"]
    }]
  }" >/dev/null

put_schedule() {
  local name="$1"
  local expression="$2"
  local description="$3"
  local target_arn="${4:-$FUNCTION_ARN}"
  local args=(
    --name "$name"
    --region "$REGION"
    --schedule-expression "$expression"
    --schedule-expression-timezone "America/New_York"
    --flexible-time-window Mode=OFF
    --description "$description"
    --target "{
      \"Arn\": \"${target_arn}\",
      \"RoleArn\": \"${SCHEDULER_ROLE_ARN}\",
      \"RetryPolicy\": {\"MaximumRetryAttempts\": 2, \"MaximumEventAgeInSeconds\": 3600}
    }"
  )

  local attempt output
  for attempt in 1 2 3 4 5 6; do
    if aws scheduler get-schedule --name "$name" --region "$REGION" >/dev/null 2>&1; then
      if output=$(aws scheduler update-schedule "${args[@]}" 2>&1); then
        return 0
      fi
    elif output=$(aws scheduler create-schedule "${args[@]}" 2>&1); then
      return 0
    fi
    echo "$output"
    echo "Waiting for the scheduler role to become assumable (${attempt}/6)..."
    sleep 10
  done
  echo "Could not create schedule ${name}" >&2
  return 1
}

put_schedule \
  "wowkeyb-wow-version-tuesday" \
  "cron(0 20 ? * TUE *)" \
  "Check live retail WoW after Tuesday maintenance, 8:00 PM Eastern"
put_schedule \
  "wowkeyb-wow-version-wednesday" \
  "cron(0 10 ? * WED *)" \
  "Catch a retail WoW patch whose Tuesday maintenance ran overnight, 10:00 AM Eastern"
put_schedule \
  "wowkeyb-wow-abilities-tuesday" \
  "cron(30 20 ? * TUE *)" \
  "Add active spells missing from the current retail version, 8:30 PM Eastern" \
  "$ABILITY_FUNCTION_ARN"
put_schedule \
  "wowkeyb-wow-abilities-wednesday" \
  "cron(30 10 ? * WED *)" \
  "Add active spells if Tuesday maintenance finished overnight, 10:30 AM Eastern" \
  "$ABILITY_FUNCTION_ARN"

echo "Deployed ${FUNCTION_NAME} and ${ABILITY_FUNCTION_NAME}"
echo "Versions: Tuesday 8:00 PM and Wednesday 10:00 AM America/New_York"
echo "Abilities: Tuesday 8:30 PM and Wednesday 10:30 AM America/New_York"
