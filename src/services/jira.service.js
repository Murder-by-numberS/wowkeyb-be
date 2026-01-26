import { Version2Client } from 'jira.js';
import axios from 'axios';
import Config from '../config/config.js';

class JiraService {
    constructor() {
        // Initialize Jira client only if configuration is provided
        const jiraHost = process.env.JIRA_HOST;
        const jiraEmail = process.env.JIRA_EMAIL;
        const jiraApiToken = process.env.JIRA_API_TOKEN;
        const jiraProjectKey = process.env.JIRA_PROJECT_KEY;

        this.jiraHost = jiraHost;
        this.jiraEmail = jiraEmail;
        this.jiraApiToken = jiraApiToken;
        this.projectKey = jiraProjectKey || 'SUPPORT';

        if (jiraHost && jiraEmail && jiraApiToken) {
            this.jira = new Version2Client({
                host: `https://${jiraHost}`,
                authentication: {
                    basic: {
                        email: jiraEmail,
                        apiToken: jiraApiToken
                    }
                }
            });

            this.enabled = true;
        } else {
            this.enabled = false;
            console.warn('Jira integration is not configured. Support tickets will be logged but not created in Jira.');
        }
    }

    /**
     * Test Jira connection
     */
    async testConnection() {
        if (!this.enabled) {
            return { success: false, message: 'Jira not configured' };
        }

        try {
            const auth = Buffer.from(`${this.jiraEmail}:${this.jiraApiToken}`).toString('base64');
            const response = await axios.get(`https://${this.jiraHost}/rest/api/2/myself`, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Accept': 'application/json'
                }
            });
            console.log('Jira connection test successful:', response.data.displayName);
            return { success: true, user: response.data.displayName };
        } catch (error) {
            console.error('Jira connection test failed:', error.response?.status, error.response?.data);
            return { success: false, error: error.message, status: error.response?.status };
        }
    }

    /**
     * Map support ticket category to Jira issue type
     */
    getIssueType(category) {
        // All tickets will be created as "Task" type
        // The category will be reflected in labels instead
        return 'Task';
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
        if (!this.enabled) {
            // Log the ticket but don't create in Jira
            console.log('Support ticket received (Jira disabled):', {
                from: ticketData.email,
                subject: ticketData.subject,
                category: ticketData.category,
                priority: ticketData.priority
            });

            return {
                success: true,
                issueKey: 'TICKET-' + Date.now(),
                issueId: Date.now().toString(),
                url: null,
                jiraDisabled: true
            };
        }

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
                    }
                }
            };

            // Add labels
            if (ticketData.category) {
                issue.fields.labels = ['support-ticket', 'wowkeyb', ticketData.category];
            }

            // Create the issue in Jira
            const result = await this.jira.issues.createIssue(issue);

            return {
                success: true,
                issueKey: result.key,
                issueId: result.id,
                url: `https://${this.jiraHost}/browse/${result.key}`
            };

        } catch (error) {
            console.error('Error creating Jira ticket:', error);

            // Don't throw error - log it and return a fallback ticket ID
            console.error('Jira ticket creation failed, ticket will be logged:', {
                from: ticketData.email,
                subject: ticketData.subject,
                error: error.message
            });

            return {
                success: false,
                issueKey: 'TICKET-' + Date.now(),
                issueId: Date.now().toString(),
                url: null,
                error: error.message
            };
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
        if (!this.enabled) {
            console.log('Comment would be added to ticket (Jira disabled):', issueKey);
            return { success: true, jira_disabled: true };
        }

        try {
            const auth = Buffer.from(`${this.jiraEmail}:${this.jiraApiToken}`).toString('base64');
            await axios.post(
                `https://${this.jiraHost}/rest/api/3/issue/${issueKey}/comment`,
                {
                    body: {
                        type: 'doc',
                        version: 1,
                        content: [
                            {
                                type: 'paragraph',
                                content: [
                                    {
                                        type: 'text',
                                        text: comment
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return { success: true };
        } catch (error) {
            console.error('Error adding comment to Jira ticket:', error.message);
            console.error('Error response:', error.response?.data);
            throw new Error(`Failed to add comment: ${error.message}`);
        }
    }

    /**
     * Get available transitions for a ticket
     */
    async getTransitions(issueKey) {
        if (!this.enabled) {
            return {
                transitions: [
                    { id: '1', name: 'To Do' },
                    { id: '2', name: 'In Progress' },
                    { id: '3', name: 'Done' }
                ],
                jira_disabled: true
            };
        }

        try {
            const auth = Buffer.from(`${this.jiraEmail}:${this.jiraApiToken}`).toString('base64');
            const response = await axios.get(
                `https://${this.jiraHost}/rest/api/3/issue/${issueKey}/transitions`,
                {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Accept': 'application/json'
                    }
                }
            );

            return {
                transitions: response.data.transitions.map(t => ({
                    id: t.id,
                    name: t.name,
                    to: t.to?.name
                }))
            };
        } catch (error) {
            console.error('Error getting transitions:', error.message);
            throw new Error(`Failed to get transitions: ${error.message}`);
        }
    }

    /**
     * Transition a ticket to a new status
     */
    async transitionTicket(issueKey, transitionId) {
        if (!this.enabled) {
            console.log('Ticket would be transitioned (Jira disabled):', issueKey, transitionId);
            return { success: true, jira_disabled: true };
        }

        try {
            const auth = Buffer.from(`${this.jiraEmail}:${this.jiraApiToken}`).toString('base64');
            await axios.post(
                `https://${this.jiraHost}/rest/api/3/issue/${issueKey}/transitions`,
                {
                    transition: {
                        id: transitionId
                    }
                },
                {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return { success: true };
        } catch (error) {
            console.error('Error transitioning ticket:', error.message);
            console.error('Error response:', error.response?.data);
            throw new Error(`Failed to transition ticket: ${error.message}`);
        }
    }

    /**
     * Get ticket status
     */
    async getTicketStatus(issueKey) {
        if (!this.enabled) {
            return {
                status: 'Pending',
                assignee: 'Unassigned',
                updated: new Date().toISOString()
            };
        }

        try {
            const issue = await this.jira.issues.getIssue({
                issueIdOrKey: issueKey
            });
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

    /**
     * Search tickets using JQL
     * @param {string} jql - JQL query string
     * @param {number} page - Page number (1-based)
     * @param {number} limit - Results per page
     */
    async searchTickets(jql, page = 1, limit = 20) {
        if (!this.enabled) {
            return {
                tickets: [],
                pagination: {
                    current_page: page,
                    total_pages: 0,
                    total_count: 0,
                    per_page: limit
                },
                jira_disabled: true
            };
        }

        try {
            const startAt = (page - 1) * limit;
            const auth = Buffer.from(`${this.jiraEmail}:${this.jiraApiToken}`).toString('base64');

            // Get issues using /search/jql endpoint
            const response = await axios.get(
                `https://${this.jiraHost}/rest/api/3/search/jql`,
                {
                    params: {
                        jql: jql,
                        startAt: startAt,
                        maxResults: limit,
                        fields: 'summary,status,priority,created,updated,assignee,reporter,labels,description'
                    },
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Accept': 'application/json'
                    }
                }
            );

            // Get total count using /search/approximate-count endpoint
            const countResponse = await axios.post(
                `https://${this.jiraHost}/rest/api/3/search/approximate-count`,
                { jql: jql },
                {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );

            const result = response.data;
            const totalCount = countResponse.data.count || 0;

            const tickets = result.issues.map(issue => ({
                id: issue.id,
                key: issue.key,
                summary: issue.fields.summary,
                status: issue.fields.status?.name || 'Unknown',
                priority: issue.fields.priority?.name || 'Medium',
                created: issue.fields.created,
                updated: issue.fields.updated,
                assignee: issue.fields.assignee?.displayName || 'Unassigned',
                reporter: issue.fields.reporter?.displayName || 'Unknown',
                labels: issue.fields.labels || [],
                url: `https://${this.jiraHost}/browse/${issue.key}`
            }));

            return {
                tickets,
                pagination: {
                    current_page: page,
                    total_pages: Math.ceil(totalCount / limit),
                    total_count: totalCount,
                    per_page: limit
                }
            };
        } catch (error) {
            console.error('Error searching Jira tickets:', error.message);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            throw new Error(`Failed to search tickets: ${error.message}`);
        }
    }

    /**
     * Get single ticket details
     * @param {string} issueKey - Jira issue key (e.g., WOW-123)
     */
    async getTicket(issueKey) {
        if (!this.enabled) {
            return {
                id: issueKey,
                key: issueKey,
                summary: 'Jira not configured',
                status: 'Pending',
                priority: 'Medium',
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                assignee: 'Unassigned',
                reporter: 'Unknown',
                description: 'Jira integration is not configured',
                labels: [],
                comments: [],
                jira_disabled: true
            };
        }

        try {
            const issue = await this.jira.issues.getIssue({
                issueIdOrKey: issueKey,
                fields: ['summary', 'status', 'priority', 'created', 'updated', 'assignee', 'reporter', 'labels', 'description', 'comment']
            });

            const comments = issue.fields.comment?.comments?.map(comment => ({
                id: comment.id,
                author: comment.author?.displayName || 'Unknown',
                body: comment.body,
                created: comment.created,
                updated: comment.updated
            })) || [];

            return {
                id: issue.id,
                key: issue.key,
                summary: issue.fields.summary,
                status: issue.fields.status?.name || 'Unknown',
                priority: issue.fields.priority?.name || 'Medium',
                created: issue.fields.created,
                updated: issue.fields.updated,
                assignee: issue.fields.assignee?.displayName || 'Unassigned',
                reporter: issue.fields.reporter?.displayName || 'Unknown',
                description: issue.fields.description || '',
                labels: issue.fields.labels || [],
                comments: comments,
                url: `https://${this.jiraHost}/browse/${issue.key}`
            };
        } catch (error) {
            console.error('Error fetching Jira ticket:', error);
            throw new Error(`Failed to fetch ticket: ${error.message}`);
        }
    }
}

export default new JiraService();

