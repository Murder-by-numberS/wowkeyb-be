import axios from 'axios';

/**
 * Check if a WoW icon URL exists on wow.zamimg.com
 */
class WoWIconChecker {
    constructor() {
        this.baseUrls = [
            'https://wow.zamimg.com/images/wow/icons/large/',
            'https://wow.zamimg.com/images/wow/icons/medium/',
            'https://wow.zamimg.com/images/wow/icons/small/',
            'https://wow.zamimg.com/images/wow/icons/tiny/'
        ];

        this.extensions = ['.jpg', '.png'];
        this.timeout = 10000;
    }

    /**
     * Check if a specific URL exists
     * @param {string} url - The URL to check
     * @returns {Promise<Object>} - Result object
     */
    async checkUrl(url) {
        try {
            console.log(`🔍 Checking: ${url}`);

            const response = await axios.head(url, {
                timeout: this.timeout,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache'
                },
                validateStatus: function (status) {
                    return status >= 200 && status < 400;
                }
            });

            return {
                url: url,
                exists: true,
                status: response.status,
                contentType: response.headers['content-type'] || 'unknown',
                contentLength: response.headers['content-length'] || 'unknown',
                lastModified: response.headers['last-modified'] || 'unknown'
            };

        } catch (error) {
            if (error.response) {
                return {
                    url: url,
                    exists: false,
                    status: error.response.status,
                    error: error.response.statusText || 'Unknown error'
                };
            } else if (error.request) {
                return {
                    url: url,
                    exists: false,
                    status: 'TIMEOUT',
                    error: 'Request timeout or network error'
                };
            } else {
                return {
                    url: url,
                    exists: false,
                    status: 'ERROR',
                    error: error.message
                };
            }
        }
    }

    /**
     * Check all possible URLs for an icon ID
     * @param {string} iconId - The icon ID (without extension)
     * @returns {Promise<Array<Object>>} - Array of results
     */
    async checkIconId(iconId) {
        const results = [];
        const urls = [];

        // Generate all possible URLs
        for (const baseUrl of this.baseUrls) {
            for (const extension of this.extensions) {
                urls.push(`${baseUrl}${iconId}${extension}`);
            }
        }

        console.log(`🔍 Checking ${urls.length} possible URLs for icon: ${iconId}\n`);

        // Check all URLs
        for (const url of urls) {
            const result = await this.checkUrl(url);
            results.push(result);

            // Small delay to be respectful
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return results;
    }

    /**
     * Check a specific full URL
     * @param {string} url - The full URL to check
     * @returns {Promise<Object>} - Result object
     */
    async checkSpecificUrl(url) {
        console.log(`🔍 Checking specific URL: ${url}\n`);
        return await this.checkUrl(url);
    }

    /**
     * Print results in a formatted way
     * @param {Array<Object>} results - Array of results
     */
    printResults(results) {
        console.log('\n' + '='.repeat(80));
        console.log('📊 WoW ICON URL CHECK RESULTS');
        console.log('='.repeat(80));

        const existingUrls = results.filter(r => r.exists);
        const missingUrls = results.filter(r => !r.exists);

        if (existingUrls.length > 0) {
            console.log(`\n✅ FOUND ${existingUrls.length} WORKING URL(S):`);
            existingUrls.forEach((result, index) => {
                console.log(`\n${index + 1}. ${result.url}`);
                console.log(`   Status: ${result.status}`);
                console.log(`   Content-Type: ${result.contentType}`);
                console.log(`   Size: ${result.contentLength} bytes`);
                if (result.lastModified !== 'unknown') {
                    console.log(`   Last Modified: ${result.lastModified}`);
                }
            });
        }

        if (missingUrls.length > 0) {
            console.log(`\n❌ NOT FOUND ${missingUrls.length} URL(S):`);
            missingUrls.forEach((result, index) => {
                console.log(`\n${index + 1}. ${result.url}`);
                console.log(`   Status: ${result.status}`);
                console.log(`   Error: ${result.error}`);
            });
        }

        console.log('\n' + '='.repeat(80));
        console.log(`📈 SUMMARY: ${existingUrls.length} working, ${missingUrls.length} missing`);
        console.log('='.repeat(80));
    }

    /**
     * Print single result
     * @param {Object} result - Single result
     */
    printSingleResult(result) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 WoW ICON URL CHECK RESULT');
        console.log('='.repeat(60));

        if (result.exists) {
            console.log(`✅ URL EXISTS: ${result.url}`);
            console.log(`📊 Status: ${result.status}`);
            console.log(`📄 Content-Type: ${result.contentType}`);
            console.log(`📦 Size: ${result.contentLength} bytes`);
            if (result.lastModified !== 'unknown') {
                console.log(`📅 Last Modified: ${result.lastModified}`);
            }
        } else {
            console.log(`❌ URL NOT FOUND: ${result.url}`);
            console.log(`📊 Status: ${result.status}`);
            console.log(`💥 Error: ${result.error}`);
        }

        console.log('='.repeat(60));
    }
}

// Run the checker if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const checker = new WoWIconChecker();
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage:');
        console.log('  node check-wow-icon-url.js <icon-id>                    # Check all sizes for icon ID');
        console.log('  node check-wow-icon-url.js --url <full-url>             # Check specific URL');
        console.log('');
        console.log('Examples:');
        console.log('  node check-wow-icon-url.js iconshadow');
        console.log('  node check-wow-icon-url.js --url "https://wow.zamimg.com/images/wow/icons/large/iconshadow.jpg"');
        process.exit(1);
    }

    async function runCheck() {
        try {
            if (args[0] === '--url' && args[1]) {
                // Check specific URL
                const result = await checker.checkSpecificUrl(args[1]);
                checker.printSingleResult(result);
            } else {
                // Check icon ID
                const iconId = args[0];
                const results = await checker.checkIconId(iconId);
                checker.printResults(results);
            }
        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    }

    runCheck();
}

export default WoWIconChecker;
