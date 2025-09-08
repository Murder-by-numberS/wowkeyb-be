#!/bin/bash

# Script to add DNS records to Route 53 for all environments

set -e

echo "[INFO] Adding DNS records to Route 53 for wowkeyb.gg..."

# Get the hosted zone ID for wowkeyb.gg
echo "[INFO] Finding hosted zone for wowkeyb.gg..."
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query 'HostedZones[?Name==`wowkeyb.gg.`].Id' --output text | sed 's|/hostedzone/||')

if [ -z "$HOSTED_ZONE_ID" ]; then
    echo "[ERROR] Could not find hosted zone for wowkeyb.gg"
    echo "[INFO] Available hosted zones:"
    aws route53 list-hosted-zones --query 'HostedZones[].{Name:Name,Id:Id}' --output table
    exit 1
fi

echo "[INFO] Found hosted zone: $HOSTED_ZONE_ID"

# Function to add CNAME record
add_cname_record() {
    local name="$1"
    local value="$2"
    local description="$3"

    echo "[INFO] Adding CNAME record: $name -> $value ($description)"

    aws route53 change-resource-record-sets \
        --hosted-zone-id "$HOSTED_ZONE_ID" \
        --change-batch '{
            "Changes": [{
                "Action": "UPSERT",
                "ResourceRecordSet": {
                    "Name": "'"$name"'",
                    "Type": "CNAME",
                    "TTL": 300,
                    "ResourceRecords": [{"Value": "'"$value"'"}]
                }
            }]
        }' > /dev/null

    echo "✅ Added: $name"
}

echo ""
echo "[INFO] Adding main domain CNAME records..."

# Main domain records
add_cname_record "develop-api.wowkeyb.gg." "sftc2ci8bm.us-east-1.awsapprunner.com" "Develop API"
add_cname_record "staging-api.wowkeyb.gg." "aievbtat4m.us-east-1.awsapprunner.com" "Staging API"
add_cname_record "api.wowkeyb.gg." "hxtqcyvww2.us-east-1.awsapprunner.com" "Production API"

echo ""
echo "[INFO] Adding SSL certificate validation records..."

# Develop SSL validation records
add_cname_record "_334987fd33c03b6ae6b30d463c2bac29.develop-api.wowkeyb.gg." "_053d1176125bbe1baab732754c2dd7f9.xlfgrmvvlj.acm-validations.aws." "Develop SSL 1"
add_cname_record "_c5ac0e9358a556a4bde6d37609c9def8.www.develop-api.wowkeyb.gg." "_516b955bcae44ac1a67d7e1f49d16435.xlfgrmvvlj.acm-validations.aws." "Develop SSL 2"
add_cname_record "_9ee4cbb116653b26d303cfb026170bee.2a57j77nf17d51at4ovlohuf3wirpo7.develop-api.wowkeyb.gg." "_25d4e67e0ca15fb25e35a8119a950b89.xlfgrmvvlj.acm-validations.aws." "Develop SSL 3"

# Staging SSL validation records
add_cname_record "_cd332f1ee8b4762d3d53251ff88b20e3.staging-api.wowkeyb.gg." "_5830ff571ccea09249718ccb3f0dc6ae.xlfgrmvvlj.acm-validations.aws." "Staging SSL 1"
add_cname_record "_81be427a5428d8bb0213d246617b917f.2a57j77nf17d51at4ovlohuf3wirpo7.staging-api.wowkeyb.gg." "_b2dab5dd65cc284a2c34175b8a98e9dd.xlfgrmvvlj.acm-validations.aws." "Staging SSL 2"
add_cname_record "_9b9b28b5210598bec2db8fe8e10b1147.www.staging-api.wowkeyb.gg." "_6b92bf89f2d73c97f556f3a810535b76.xlfgrmvvlj.acm-validations.aws." "Staging SSL 3"

# Production SSL validation records
add_cname_record "_1e8be59f74c97f7639bcd50f54aef979.api.wowkeyb.gg." "_addd639fe69475ec0d7224391ef5e18d.xlfgrmvvlj.acm-validations.aws." "Production SSL 1"
add_cname_record "_e54855005496f22891557ffeb1cec9ac.2a57j77nf17d51at4ovlohuf3wirpo7.api.wowkeyb.gg." "_daf7338237d85e8276689ae7d8597cc3.xlfgrmvvlj.acm-validations.aws." "Production SSL 2"
add_cname_record "_547071fa22f227477fe3ed6d46056b59.www.api.wowkeyb.gg." "_5015199031727983a977533972b32dfe.xlfgrmvvlj.acm-validations.aws." "Production SSL 3"

echo ""
echo "[SUCCESS] All DNS records have been added to Route 53!"
echo ""
echo "[INFO] DNS propagation typically takes 5-15 minutes"
echo "[INFO] SSL certificate validation will happen automatically after DNS propagation"
echo ""
echo "[INFO] Your APIs will be available at:"
echo "- https://develop-api.wowkeyb.gg"
echo "- https://staging-api.wowkeyb.gg"
echo "- https://api.wowkeyb.gg"
echo ""
echo "[INFO] To monitor progress, run:"
echo "aws apprunner describe-custom-domains --service-arn <SERVICE_ARN>"
