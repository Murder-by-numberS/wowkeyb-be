import axios from 'axios';

const BASE_URL = 'http://localhost:1337';

async function testIconSearch() {
    try {
        console.log('🔍 Testing icon search for: 0raid_necklace_1b');
        console.log('='.repeat(50));

        // Test the new icon validation endpoint
        console.log('\n1. Testing icon validation endpoint...');
        try {
            const response = await axios.get(`${BASE_URL}/api/icons/validate/0raid_necklace_1b`);
            console.log('✅ Icon validation response:');
            console.log(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log('❌ Icon validation failed:', error.message);
        }

        // Test the Wago search endpoint
        console.log('\n2. Testing Wago search endpoint...');
        try {
            const response = await axios.get(`${BASE_URL}/api/wago-icons/search/0raid_necklace_1b`);
            console.log('✅ Wago search response:');
            console.log(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log('❌ Wago search failed:', error.message);
        }

        // Test URL validation
        console.log('\n3. Testing URL validation...');
        const testUrls = [
            'https://wow.zamimg.com/images/wow/icons/large/0raid_necklace_1b.jpg',
            'https://wow.zamimg.com/images/wow/icons/medium/0raid_necklace_1b.jpg',
            'https://wow.zamimg.com/images/wow/icons/small/0raid_necklace_1b.jpg',
            'https://wow.zamimg.com/images/wow/icons/tiny/0raid_necklace_1b.jpg'
        ];

        for (const url of testUrls) {
            try {
                const response = await axios.post(`${BASE_URL}/api/icons/validate-url`, { url });
                console.log(`✅ URL validation for ${url}:`, response.data.validation.isAccessible ? 'ACCESSIBLE' : 'NOT ACCESSIBLE');
            } catch (error) {
                console.log(`❌ URL validation failed for ${url}:`, error.message);
            }
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testIconSearch();
