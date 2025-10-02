import mongoose from 'mongoose';
import axios from 'axios';
import config from '../config/config.js';
import { Icon } from '../models/index.js';

/**
 * Simple test script to verify the icon checker works
 * Tests with just a few icons from the database
 */
async function testIconChecker() {
    try {
        console.log('🧪 Testing Icon Checker with Sample Data');
        console.log('=========================================');

        // Connect to database
        if (!config.databaseURI) {
            throw new Error('DATABASE_URI environment variable is not set');
        }
        await mongoose.connect(config.databaseURI);
        console.log('✅ Connected to MongoDB');

        // Get a small sample of icons (first 5)
        const sampleIcons = await Icon.find().limit(5);
        console.log(`📊 Testing with ${sampleIcons.length} sample icons`);

        if (sampleIcons.length === 0) {
            console.log('⚠️  No icons found in database');
            return;
        }

        // Test each icon
        for (const icon of sampleIcons) {
            console.log(`\n🔍 Testing: ${icon.iconId} (${icon.name})`);
            console.log(`   URL: ${icon.url}`);

            try {
                const response = await axios.head(icon.url, {
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status < 400;
                    }
                });

                console.log(`   ✅ Status: ${response.status} (Working)`);
                console.log(`   📄 Content-Type: ${response.headers['content-type'] || 'unknown'}`);

            } catch (error) {
                if (error.response) {
                    console.log(`   ❌ Status: ${error.response.status} (Broken)`);
                    console.log(`   💥 Error: ${error.response.statusText}`);
                } else if (error.request) {
                    console.log(`   ⏰ Status: TIMEOUT (Broken)`);
                    console.log(`   💥 Error: Request timeout`);
                } else {
                    console.log(`   ❓ Status: ERROR (Broken)`);
                    console.log(`   💥 Error: ${error.message}`);
                }
            }

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('\n✅ Test completed!');
        console.log('💡 Run the full checker with: ./scripts/check-broken-icons.sh');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the test
testIconChecker();
