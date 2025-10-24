import jiraService from '../services/jira.service.js';
import Logger from '../utils/logger.js';

async function testJiraConnection() {
    try {
        console.log('\n===========================================');
        console.log('Testing Jira Connection');
        console.log('===========================================\n');

        // Check if Jira is enabled
        if (!jiraService.enabled) {
            console.log('❌ Jira integration is not configured.');
            console.log('\nPlease set the following environment variables:');
            console.log('  - JIRA_HOST');
            console.log('  - JIRA_EMAIL');
            console.log('  - JIRA_API_TOKEN');
            console.log('  - JIRA_PROJECT_KEY (optional, defaults to SUPPORT)\n');
            return;
        }

        console.log('✅ Jira is configured and enabled\n');
        console.log('Creating test ticket...\n');

        // Test ticket creation
        const result = await jiraService.createTicket({
            name: 'Test User',
            email: 'test@example.com',
            category: 'technical',
            priority: 'medium',
            subject: 'Test Support Ticket - Connection Test',
            description: 'This is a test ticket created to verify Jira integration is working correctly. You can safely close this ticket.'
        });

        console.log('===========================================');
        console.log('✅ Success! Test ticket created');
        console.log('===========================================\n');
        console.log('Ticket Details:');
        console.log(`  Issue Key: ${result.issueKey}`);
        console.log(`  Issue ID:  ${result.issueId}`);
        console.log(`  URL:       ${result.url}`);
        console.log('\n');

    } catch (error) {
        console.log('\n===========================================');
        console.log('❌ Error creating Jira ticket');
        console.log('===========================================\n');
        console.error('Error:', error.message);
        console.error('\nFull error:', error);
        console.log('\n');
    }
}

testJiraConnection();

