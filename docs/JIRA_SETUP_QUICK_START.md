# Jira Integration - Quick Start Guide

This guide will help you set up Jira integration for the WowKeyb support ticket system.

## Prerequisites

- Jira Cloud account (or Jira Server/Data Center)
- Jira project for support tickets (recommended project key: `SUPPORT`)
- Jira API token

## Quick Setup

### 1. Get Jira API Credentials

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Label it: `WowKeyb Support Integration`
4. Copy the token (save it - you won't see it again!)

### 2. Add Environment Variables

Add these to your `.env.development` (or `.env.staging`, `.env.production`):

```env
# Jira Configuration
JIRA_HOST=your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_api_token_here
JIRA_PROJECT_KEY=SUPPORT

# Support Email Configuration (optional)
SUPPORT_TEAM_EMAIL=support@wowkeyb.gg
SUPPORT_EMAIL_FROM=mail@wowkeyb.gg
```

### 3. Add to AWS Parameter Store (Production)

For production/staging environments, add to AWS Parameter Store:

```bash
# Development
aws ssm put-parameter --name "/wowkeyb/develop/JIRA_HOST" --type "String" --value "your-domain.atlassian.net"
aws ssm put-parameter --name "/wowkeyb/develop/JIRA_EMAIL" --type "String" --value "your-email@example.com"
aws ssm put-parameter --name "/wowkeyb/develop/JIRA_API_TOKEN" --type "SecureString" --value "your_api_token_here"
aws ssm put-parameter --name "/wowkeyb/develop/JIRA_PROJECT_KEY" --type "String" --value "SUPPORT"
aws ssm put-parameter --name "/wowkeyb/develop/SUPPORT_TEAM_EMAIL" --type "String" --value "support@wowkeyb.gg"

# Repeat for staging and production
```

### 4. Test the Integration

Run the test script to verify Jira is working:

```bash
npm run test-jira:dev
```

Expected output:
```
✅ Jira is configured and enabled
Creating test ticket...
✅ Success! Test ticket created
  Issue Key: SUPPORT-123
  Issue ID:  10001
  URL:       https://your-domain.atlassian.net/browse/SUPPORT-123
```

### 5. Start the Server

```bash
npm run dev
```

## API Endpoint

The support ticket endpoint is now available:

**POST** `/api/support/ticket`

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "category": "technical",
  "priority": "medium",
  "subject": "Issue with keybinds",
  "description": "Detailed description of the issue..."
}
```

### Categories

- `technical` - Technical issues
- `bug` - Bug reports
- `account` - Account-related issues
- `keybind` - Keybind help
- `macro` - Macro help
- `feature` - Feature requests
- `other` - Other inquiries

### Priorities

- `low` - General question
- `medium` - Need assistance (default)
- `high` - Blocking issue
- `urgent` - Critical problem

### Response

```json
{
  "success": true,
  "message": "Support ticket created successfully",
  "ticket": {
    "issue_key": "SUPPORT-123",
    "url": "https://your-domain.atlassian.net/browse/SUPPORT-123"
  }
}
```

## Rate Limiting

The endpoint is rate-limited to prevent abuse:
- Maximum 3 tickets per IP address per 15 minutes

## Email Notifications

When properly configured, the system sends:
1. **Confirmation email to user** - With ticket ID and tracking link
2. **Notification to support team** - With all ticket details

## Graceful Degradation

If Jira is not configured or unavailable:
- Tickets are logged to console
- A temporary ticket ID is generated
- Users still receive confirmation
- No errors are thrown

## Jira Issue Configuration

The integration creates issues with:
- **Project**: As specified in `JIRA_PROJECT_KEY`
- **Issue Type**: Mapped from category (Bug, Task, Story)
- **Priority**: Mapped from priority (Low, Medium, High, Highest)
- **Labels**: `support-ticket`, `wowkeyb`, category name
- **Description**: Formatted with user details and ticket info

## Troubleshooting

### "Jira integration is not configured"
- Check all environment variables are set
- Verify the variable names match exactly
- Restart the server after adding variables

### "Unauthorized" error
- Verify API token is correct
- Check email matches Atlassian account
- Ensure token hasn't expired

### "Project does not exist"
- Verify project key is correct
- Check you have access to the project
- Project key is case-sensitive

### Emails not sending
- Check AWS SES is configured
- Verify email addresses are verified in SES
- Check CloudWatch logs for SES errors

## For More Details

See the comprehensive guide: [`docs/JIRA_INTEGRATION.md`](./JIRA_INTEGRATION.md)

## Support

If you encounter issues:
1. Run `npm run test-jira:dev` to diagnose
2. Check application logs
3. Verify Jira project permissions
4. Review AWS SES configuration

