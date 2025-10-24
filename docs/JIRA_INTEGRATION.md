# Jira Integration Guide for Support Tickets

This guide explains how to integrate the WowKeyb support ticket system with Atlassian Jira for ticket management.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup Jira API Access](#setup-jira-api-access)
4. [Backend Implementation](#backend-implementation)
5. [Environment Configuration](#environment-configuration)
6. [API Integration](#api-integration)
7. [Testing](#testing)
8. [Best Practices](#best-practices)

---

## Overview

The support ticket system can be integrated with Jira to automatically create issues when users submit support tickets. This allows your support team to track and manage tickets within Jira's powerful project management interface.

### Integration Flow

```
User submits ticket → Frontend sends request → Backend creates Jira issue → User receives confirmation
```

---

## Prerequisites

1. **Jira Account**: You need a Jira Cloud account (or Jira Server/Data Center)
2. **Jira Project**: Create a dedicated project for support tickets (e.g., "SUPPORT")
3. **API Access**: Jira API credentials (API token or OAuth)
4. **Node.js Jira Client**: Install the Jira client library

---

## Setup Jira API Access

### Step 1: Create API Token (Jira Cloud)

1. Log in to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Enter a label (e.g., "WowKeyb Support Integration")
4. Copy the generated token (you won't be able to see it again!)

### Step 2: Get Your Jira Details

You'll need:
- **Jira URL**: `https://your-domain.atlassian.net`
- **Email**: Your Atlassian account email
- **API Token**: The token from Step 1
- **Project Key**: The key of your Jira project (e.g., "SUPPORT")

### Step 3: Identify Issue Type ID

1. Go to your Jira project
2. Navigate to **Project Settings → Issue Types**
3. Note the issue types you want to use (e.g., "Bug", "Task", "Support Request")

---

## Backend Implementation

### Install Required Package

```bash
npm install jira.js
```

**Note:** We use the modern [jira.js](https://mrrefactoring.github.io/jira.js/) library instead of the deprecated `jira-client`.

### Create Jira Service

Create a new file: `src/services/jira.service.js`

```javascript
const JiraClient = require('jira-client');

class JiraService {
    constructor() {
        // Initialize Jira client
        this.jira = new JiraClient({
            protocol: 'https',
            host: process.env.JIRA_HOST, // e.g., 'your-domain.atlassian.net'
            username: process.env.JIRA_EMAIL,
            password: process.env.JIRA_API_TOKEN,
            apiVersion: '2',
            strictSSL: true
        });

        this.projectKey = process.env.JIRA_PROJECT_KEY || 'SUPPORT';
    }

    /**
     * Map support ticket category to Jira issue type
     */
    getIssueType(category) {
        const issueTypeMap = {
            'technical': 'Bug',
            'bug': 'Bug',
            'account': 'Task',
            'keybind': 'Task',
            'macro': 'Task',
            'feature': 'Story',
            'other': 'Task'
        };

        return issueTypeMap[category] || 'Task';
    }

    /**
     * Map support ticket priority to Jira priority
     */
    getJiraPriority(priority) {
        const priorityMap = {
            'low': 'Low',
            'medium': 'Medium',
            'high': 'High',
            'urgent': 'Highest'
        };

        return priorityMap[priority] || 'Medium';
    }

    /**
     * Create a Jira issue from a support ticket
     */
    async createTicket(ticketData) {
        try {
            const issueType = this.getIssueType(ticketData.category);
            const priority = this.getJiraPriority(ticketData.priority);

            const issue = {
                fields: {
                    project: {
                        key: this.projectKey
                    },
                    summary: ticketData.subject,
                    description: this.formatDescription(ticketData),
                    issuetype: {
                        name: issueType
                    },
                    priority: {
                        name: priority
                    },
                    // Add custom fields if needed
                    // customfield_10000: ticketData.email
                }
            };

            // Add labels
            if (ticketData.category) {
                issue.fields.labels = ['support-ticket', ticketData.category];
            }

            // Create the issue in Jira
            const result = await this.jira.addNewIssue(issue);

            return {
                success: true,
                issueKey: result.key,
                issueId: result.id,
                url: `https://${process.env.JIRA_HOST}/browse/${result.key}`
            };

        } catch (error) {
            console.error('Error creating Jira ticket:', error);
            throw new Error(`Failed to create Jira ticket: ${error.message}`);
        }
    }

    /**
     * Format the ticket description for Jira
     */
    formatDescription(ticketData) {
        return `
*Submitted by:* ${ticketData.name}
*Email:* ${ticketData.email}
*Category:* ${ticketData.category}
*Priority:* ${ticketData.priority}

---

h3. Description

${ticketData.description}

---

_Ticket created via WowKeyb Support System_
_Submitted at: ${new Date().toISOString()}_
        `.trim();
    }

    /**
     * Add a comment to an existing ticket
     */
    async addComment(issueKey, comment) {
        try {
            await this.jira.addComment(issueKey, comment);
            return { success: true };
        } catch (error) {
            console.error('Error adding comment to Jira ticket:', error);
            throw new Error(`Failed to add comment: ${error.message}`);
        }
    }

    /**
     * Get ticket status
     */
    async getTicketStatus(issueKey) {
        try {
            const issue = await this.jira.findIssue(issueKey);
            return {
                status: issue.fields.status.name,
                assignee: issue.fields.assignee?.displayName || 'Unassigned',
                updated: issue.fields.updated
            };
        } catch (error) {
            console.error('Error fetching Jira ticket:', error);
            throw new Error(`Failed to fetch ticket: ${error.message}`);
        }
    }
}

module.exports = new JiraService();
```

### Create Support Ticket Controller

Create or update: `src/controllers/support/support.js`

```javascript
const jiraService = require('../../services/jira.service');
const { sendEmail } = require('../../config/ses');

/**
 * Submit a support ticket
 */
const submitTicket = async (req, res) => {
    try {
        const { name, email, category, priority, subject, description } = req.body;

        // Validate required fields
        if (!name || !email || !category || !subject || !description) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Create ticket in Jira
        const jiraResult = await jiraService.createTicket({
            name,
            email,
            category,
            priority: priority || 'medium',
            subject,
            description
        });

        // Send confirmation email to user
        await sendConfirmationEmail({
            email,
            name,
            subject,
            issueKey: jiraResult.issueKey,
            issueUrl: jiraResult.url
        });

        // Send notification to support team (optional)
        if (process.env.SUPPORT_TEAM_EMAIL) {
            await sendSupportNotification({
                ticketData: { name, email, category, priority, subject, description },
                issueKey: jiraResult.issueKey,
                issueUrl: jiraResult.url
            });
        }

        res.status(201).json({
            success: true,
            message: 'Support ticket created successfully',
            ticket: {
                issueKey: jiraResult.issueKey,
                url: jiraResult.url
            }
        });

    } catch (error) {
        console.error('Error submitting support ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit support ticket',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Send confirmation email to user
 */
const sendConfirmationEmail = async ({ email, name, subject, issueKey, issueUrl }) => {
    const emailContent = `
        <h2>Support Ticket Received</h2>
        <p>Hi ${name},</p>
        <p>Thank you for contacting WowKeyb Support. We've received your support ticket and our team will respond within 24-48 hours.</p>

        <h3>Ticket Details</h3>
        <p><strong>Ticket ID:</strong> ${issueKey}</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <p>You can track the status of your ticket here: <a href="${issueUrl}">${issueUrl}</a></p>

        <p>Best regards,<br>WowKeyb Support Team</p>
    `;

    await sendEmail({
        to: email,
        subject: `Support Ticket Created - ${issueKey}`,
        html: emailContent
    });
};

/**
 * Send notification to support team
 */
const sendSupportNotification = async ({ ticketData, issueKey, issueUrl }) => {
    const emailContent = `
        <h2>New Support Ticket</h2>
        <p>A new support ticket has been submitted:</p>

        <h3>Ticket Details</h3>
        <p><strong>Ticket ID:</strong> ${issueKey}</p>
        <p><strong>From:</strong> ${ticketData.name} (${ticketData.email})</p>
        <p><strong>Category:</strong> ${ticketData.category}</p>
        <p><strong>Priority:</strong> ${ticketData.priority}</p>
        <p><strong>Subject:</strong> ${ticketData.subject}</p>

        <p><a href="${issueUrl}">View ticket in Jira</a></p>
    `;

    await sendEmail({
        to: process.env.SUPPORT_TEAM_EMAIL,
        subject: `[SUPPORT] New Ticket: ${ticketData.subject}`,
        html: emailContent
    });
};

module.exports = {
    submitTicket
};
```

### Create Support Routes

Create: `src/routes/api/support.js`

```javascript
const express = require('express');
const router = express.Router();
const { submitTicket } = require('../../controllers/support/support');

// Rate limiting middleware (optional but recommended)
const rateLimit = require('express-rate-limit');

const ticketLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 ticket submissions per windowMs
    message: 'Too many support tickets submitted, please try again later'
});

// POST /api/support/ticket - Submit a support ticket
router.post('/ticket', ticketLimiter, submitTicket);

module.exports = router;
```

### Register Routes in Main Router

Update: `src/routes/api.js`

```javascript
const supportRouter = require('./api/support');

// ... existing routes ...

// Support routes
app.use('/api/support', supportRouter);
```

---

## Environment Configuration

Add these variables to your `.env` file:

```env
# Jira Configuration
JIRA_HOST=your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_api_token_here
JIRA_PROJECT_KEY=SUPPORT

# Support Team Email (optional)
SUPPORT_TEAM_EMAIL=support@wowkeyb.com
```

Add to AWS Parameter Store for production:

```bash
# Development environment
aws ssm put-parameter \
    --name "/wowkeyb/develop/JIRA_HOST" \
    --type "String" \
    --value "your-domain.atlassian.net"

aws ssm put-parameter \
    --name "/wowkeyb/develop/JIRA_EMAIL" \
    --type "String" \
    --value "your-email@example.com"

aws ssm put-parameter \
    --name "/wowkeyb/develop/JIRA_API_TOKEN" \
    --type "SecureString" \
    --value "your_api_token_here"

aws ssm put-parameter \
    --name "/wowkeyb/develop/JIRA_PROJECT_KEY" \
    --type "String" \
    --value "SUPPORT"

# Repeat for staging and production environments
```

---

## API Integration

### Update Frontend Service

The frontend ticket component is already set up. You just need to update the submit function to call your backend API.

Update: `src/app/modules/support/ticket/ticket.component.ts`

Replace the setTimeout simulation with an actual API call:

```typescript
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

// In the constructor, inject HttpClient
constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
    private _http: HttpClient
) {
    // ... existing code
}

// Update submitTicket method
submitTicket(): void {
    if (this.ticketForm.invalid) {
        Object.keys(this.ticketForm.controls).forEach(key => {
            this.ticketForm.get(key)?.markAsTouched();
        });
        return;
    }

    this.isSubmitting = true;

    // Get form values
    const ticketData = {
        name: this.ticketForm.get('name')?.value,
        email: this.ticketForm.get('email')?.value,
        category: this.ticketForm.get('category')?.value,
        priority: this.ticketForm.get('priority')?.value,
        subject: this.ticketForm.get('subject')?.value,
        description: this.ticketForm.get('description')?.value
    };

    // Call backend API
    this._http.post(`${environment.apiUrl}/support/ticket`, ticketData)
        .subscribe({
            next: (response: any) => {
                this.isSubmitting = false;
                this.submitted = true;

                this._snackBar.open(
                    `Support ticket ${response.ticket.issueKey} submitted successfully! We'll get back to you soon.`,
                    'Close',
                    {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['success-snackbar']
                    }
                );

                // Reset form
                this.ticketForm.reset({ priority: 'medium' });
            },
            error: (error) => {
                this.isSubmitting = false;

                this._snackBar.open(
                    error.error?.message || 'Failed to submit ticket. Please try again.',
                    'Close',
                    {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: ['error-snackbar']
                    }
                );
            }
        });
}
```

Don't forget to add HttpClient to the imports array in the component:

```typescript
imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterLink,
    HttpClient  // Add this
]
```

---

## Testing

### Test Jira Connection

Create a test script: `src/scripts/test-jira-connection.js`

```javascript
require('dotenv').config();
const jiraService = require('../services/jira.service');

async function testJiraConnection() {
    try {
        console.log('Testing Jira connection...');

        // Test ticket creation
        const result = await jiraService.createTicket({
            name: 'Test User',
            email: 'test@example.com',
            category: 'technical',
            priority: 'medium',
            subject: 'Test Support Ticket',
            description: 'This is a test ticket created to verify Jira integration.'
        });

        console.log('✅ Success! Ticket created:', result);
        console.log('Issue Key:', result.issueKey);
        console.log('Issue URL:', result.url);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testJiraConnection();
```

Run the test:

```bash
node src/scripts/test-jira-connection.js
```

### Test API Endpoint

```bash
curl -X POST http://localhost:3000/api/support/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "category": "technical",
    "priority": "medium",
    "subject": "Test ticket",
    "description": "This is a test support ticket submission"
  }'
```

---

## Best Practices

### 1. Error Handling

Always handle Jira API errors gracefully. If Jira is down, you might want to:
- Store tickets in your database as a backup
- Send an email to your support team
- Notify the user that their ticket was received but processing is delayed

### 2. Rate Limiting

Implement rate limiting to prevent abuse:
- Limit ticket submissions per IP address
- Limit submissions per authenticated user
- Use CAPTCHA for unauthenticated users

### 3. Data Privacy

- Don't store sensitive information in Jira custom fields
- Use secure fields for PII data
- Implement proper access controls in Jira

### 4. Monitoring

Set up monitoring for:
- Failed ticket creations
- API response times
- Jira API quota usage

### 5. Webhooks (Advanced)

Set up Jira webhooks to sync ticket status back to your application:
- Notify users when their ticket is resolved
- Update ticket status in your database
- Send follow-up emails

---

## Troubleshooting

### Common Issues

**Error: "Unauthorized"**
- Check your API token is correct
- Verify your email matches the Atlassian account
- Ensure the token hasn't expired

**Error: "Project does not exist"**
- Verify the project key is correct
- Check you have access to the project

**Error: "Field 'priority' cannot be set"**
- Some Jira configurations have custom priority schemes
- Check your project's field configuration

**Error: "Issue type not found"**
- Verify the issue type exists in your project
- Check the issue type name spelling

---

## Additional Resources

- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v2/intro/)
- [jira-client npm package](https://www.npmjs.com/package/jira-client)
- [Atlassian API Tokens](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)

---

## Support

If you need help with Jira integration, please:
1. Check the [troubleshooting section](#troubleshooting)
2. Review Atlassian's documentation
3. Contact the WowKeyb development team

