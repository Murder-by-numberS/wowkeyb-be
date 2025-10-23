import jiraService from '../../services/jira.service.js';
import sesClient from '../../config/ses.js';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import Logger from '../../utils/logger.js';
import Config from '../../config/config.js';

/**
 * Submit a support ticket
 */
export const submitTicket = async (req, res) => {
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

        // Validate subject length
        if (subject.length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Subject must be at least 5 characters long'
            });
        }

        // Validate description length
        if (description.length < 20) {
            return res.status(400).json({
                success: false,
                message: 'Description must be at least 20 characters long'
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
        try {
            await sendConfirmationEmail({
                email,
                name,
                subject,
                issueKey: jiraResult.issueKey,
                issueUrl: jiraResult.url
            });
        } catch (emailError) {
            Logger.error('Failed to send confirmation email:', emailError);
            // Continue even if email fails
        }

        // Send notification to support team (optional)
        const supportTeamEmail = process.env.SUPPORT_TEAM_EMAIL;
        if (supportTeamEmail) {
            try {
                await sendSupportNotification({
                    ticketData: { name, email, category, priority: priority || 'medium', subject, description },
                    issueKey: jiraResult.issueKey,
                    issueUrl: jiraResult.url
                });
            } catch (emailError) {
                Logger.error('Failed to send support team notification:', emailError);
                // Continue even if email fails
            }
        }

        res.status(201).json({
            success: true,
            message: 'Support ticket created successfully',
            ticket: {
                issue_key: jiraResult.issueKey,
                url: jiraResult.url
            }
        });

    } catch (error) {
        Logger.error('Error submitting support ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit support ticket',
            error: Config.nodeEnv === 'development' ? error.message : undefined
        });
    }
};

/**
 * Send confirmation email to user
 */
const sendConfirmationEmail = async ({ email, name, subject, issueKey, issueUrl }) => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .ticket-details { background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .ticket-details h3 { margin-top: 0; color: #1f2937; }
        .ticket-info { margin: 10px 0; }
        .ticket-info strong { color: #4b5563; }
        .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Support Ticket Received</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for contacting WowKeyb Support. We've received your support ticket and our team will respond within 24-48 hours.</p>
            
            <div class="ticket-details">
                <h3>Ticket Details</h3>
                <div class="ticket-info"><strong>Ticket ID:</strong> ${issueKey}</div>
                <div class="ticket-info"><strong>Subject:</strong> ${subject}</div>
                <div class="ticket-info"><strong>Status:</strong> Open</div>
            </div>
            
            ${issueUrl ? `<p>You can track the status of your ticket here:</p>
            <a href="${issueUrl}" class="button">View Ticket</a>` : ''}
            
            <p>You will receive an email notification when our team responds to your ticket.</p>
            
            <p>Best regards,<br><strong>WowKeyb Support Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message from WowKeyb Support System.</p>
            <p>&copy; ${new Date().getFullYear()} WowKeyb. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    const textContent = `
Support Ticket Received

Hi ${name},

Thank you for contacting WowKeyb Support. We've received your support ticket and our team will respond within 24-48 hours.

Ticket Details:
- Ticket ID: ${issueKey}
- Subject: ${subject}
- Status: Open

${issueUrl ? `You can track the status of your ticket here: ${issueUrl}` : ''}

You will receive an email notification when our team responds to your ticket.

Best regards,
WowKeyb Support Team

---
This is an automated message from WowKeyb Support System.
© ${new Date().getFullYear()} WowKeyb. All rights reserved.
    `;

    await sendEmail({
        to: email,
        subject: `Support Ticket Created - ${issueKey}`,
        html: htmlContent,
        text: textContent
    });
};

/**
 * Send notification to support team
 */
const sendSupportNotification = async ({ ticketData, issueKey, issueUrl }) => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .ticket-details { background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .ticket-details h3 { margin-top: 0; color: #1f2937; }
        .ticket-info { margin: 10px 0; padding: 8px; border-left: 3px solid #2563eb; padding-left: 15px; }
        .ticket-info strong { color: #4b5563; display: block; margin-bottom: 5px; }
        .description { background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0; white-space: pre-wrap; }
        .priority-high { border-left-color: #dc2626; }
        .priority-urgent { border-left-color: #991b1b; }
        .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎫 New Support Ticket</h1>
        </div>
        <div class="content">
            <p>A new support ticket has been submitted and requires attention.</p>
            
            <div class="ticket-details">
                <h3>Ticket Information</h3>
                <div class="ticket-info ${ticketData.priority === 'high' || ticketData.priority === 'urgent' ? 'priority-high' : ''}">
                    <strong>Ticket ID:</strong>
                    ${issueKey}
                </div>
                <div class="ticket-info">
                    <strong>From:</strong>
                    ${ticketData.name} (${ticketData.email})
                </div>
                <div class="ticket-info">
                    <strong>Category:</strong>
                    ${ticketData.category.charAt(0).toUpperCase() + ticketData.category.slice(1)}
                </div>
                <div class="ticket-info">
                    <strong>Priority:</strong>
                    ${ticketData.priority.toUpperCase()}
                </div>
                <div class="ticket-info">
                    <strong>Subject:</strong>
                    ${ticketData.subject}
                </div>
                <div class="ticket-info">
                    <strong>Description:</strong>
                    <div class="description">${ticketData.description}</div>
                </div>
            </div>
            
            ${issueUrl ? `<a href="${issueUrl}" class="button">View Ticket in Jira</a>` : ''}
            
            <p><em>Please respond to the customer within 24-48 hours.</em></p>
        </div>
    </div>
</body>
</html>
    `;

    const textContent = `
New Support Ticket

A new support ticket has been submitted and requires attention.

Ticket Information:
- Ticket ID: ${issueKey}
- From: ${ticketData.name} (${ticketData.email})
- Category: ${ticketData.category}
- Priority: ${ticketData.priority.toUpperCase()}
- Subject: ${ticketData.subject}

Description:
${ticketData.description}

${issueUrl ? `View ticket in Jira: ${issueUrl}` : ''}

Please respond to the customer within 24-48 hours.
    `;

    const supportTeamEmail = process.env.SUPPORT_TEAM_EMAIL;
    await sendEmail({
        to: supportTeamEmail,
        subject: `[SUPPORT] ${ticketData.priority.toUpperCase()} - ${ticketData.subject}`,
        html: htmlContent,
        text: textContent
    });
};

/**
 * Generic email sending function using SES
 */
const sendEmail = async ({ to, subject, html, text }) => {
    // Check if AWS credentials are configured
    if (!Config.accessKey || !Config.secretAccessKey || !Config.region) {
        Logger.warn('AWS SES not configured, skipping email send');
        return;
    }

    const params = {
        Source: process.env.SUPPORT_EMAIL_FROM || 'mail@wowkeyb.gg',
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: 'UTF-8'
            },
            Body: {
                Html: {
                    Data: html,
                    Charset: 'UTF-8'
                },
                Text: {
                    Data: text,
                    Charset: 'UTF-8'
                }
            }
        }
    };

    try {
        const command = new SendEmailCommand(params);
        const result = await sesClient.send(command);
        Logger.info('Support email sent successfully:', result.MessageId);
        return result;
    } catch (error) {
        Logger.error('Error sending support email:', error);
        throw error;
    }
};

