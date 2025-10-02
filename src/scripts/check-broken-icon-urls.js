import mongoose from 'mongoose';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models and config
import { Icon } from '../models/index.js';
import config from '../config/config.js';

/**
 * Script to check all icon URLs in the database and identify broken ones (404s)
 */
class BrokenIconChecker {
    constructor() {
        this.brokenUrls = [];
        this.workingUrls = [];
        this.errors = [];
        this.processedCount = 0;
        this.totalCount = 0;
        this.batchSize = 10; // Process icons in batches
        this.delayBetweenBatches = 1000; // 1 second delay between batches
        this.timeout = 10000; // 10 second timeout per request
    }

    /**
     * Connect to MongoDB
     */
    async connectToDatabase() {
        try {
            if (!config.databaseURI) {
                throw new Error('DATABASE_URI environment variable is not set');
            }
            await mongoose.connect(config.databaseURI);
            console.log('✅ Connected to MongoDB');
        } catch (error) {
            console.error('❌ Failed to connect to MongoDB:', error.message);
            process.exit(1);
        }
    }

    /**
     * Test if a URL is accessible (not 404)
     * @param {string} url - The URL to test
     * @returns {Promise<Object>} - Result object with status and details
     */
    async testUrl(url) {
        try {
            const response = await axios.head(url, {
                timeout: this.timeout,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache'
                },
                validateStatus: function (status) {
                    return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
                }
            });

            return {
                status: response.status,
                isWorking: true,
                contentType: response.headers['content-type'] || 'unknown',
                contentLength: response.headers['content-length'] || 'unknown'
            };
        } catch (error) {
            if (error.response) {
                // Server responded with error status
                return {
                    status: error.response.status,
                    isWorking: false,
                    error: error.response.statusText || 'Unknown error'
                };
            } else if (error.request) {
                // Request was made but no response received
                return {
                    status: 'TIMEOUT',
                    isWorking: false,
                    error: 'Request timeout or network error'
                };
            } else {
                // Something else happened
                return {
                    status: 'ERROR',
                    isWorking: false,
                    error: error.message
                };
            }
        }
    }

    /**
     * Process a batch of icons
     * @param {Array} icons - Array of icon objects
     * @returns {Promise<void>}
     */
    async processBatch(icons) {
        const promises = icons.map(async (icon) => {
            const result = await this.testUrl(icon.url);

            const iconResult = {
                iconId: icon.iconId,
                name: icon.name,
                url: icon.url,
                source: icon.source,
                isVerified: icon.isVerified,
                usageCount: icon.usageCount,
                ...result
            };

            if (result.isWorking) {
                this.workingUrls.push(iconResult);
            } else {
                this.brokenUrls.push(iconResult);
            }

            this.processedCount++;

            // Progress indicator
            if (this.processedCount % 50 === 0) {
                console.log(`📊 Progress: ${this.processedCount}/${this.totalCount} icons processed (${((this.processedCount / this.totalCount) * 100).toFixed(1)}%)`);
            }
        });

        await Promise.all(promises);
    }

    /**
     * Check all icons in the database
     */
    async checkAllIcons() {
        try {
            console.log('🔍 Starting icon URL validation...');

            // Get total count
            this.totalCount = await Icon.countDocuments();
            console.log(`📈 Found ${this.totalCount} icons in database`);

            if (this.totalCount === 0) {
                console.log('⚠️  No icons found in database');
                return;
            }

            // Process icons in batches
            const totalBatches = Math.ceil(this.totalCount / this.batchSize);
            console.log(`🔄 Processing in ${totalBatches} batches of ${this.batchSize} icons each`);

            for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
                const skip = batchNum * this.batchSize;

                console.log(`📦 Processing batch ${batchNum + 1}/${totalBatches} (icons ${skip + 1}-${Math.min(skip + this.batchSize, this.totalCount)})`);

                // Get batch of icons
                const icons = await Icon.find()
                    .sort({ _id: 1 }) // Consistent ordering
                    .skip(skip)
                    .limit(this.batchSize);

                await this.processBatch(icons);

                // Add delay between batches to be respectful to external servers
                if (batchNum < totalBatches - 1) {
                    await new Promise(resolve => setTimeout(resolve, this.delayBetweenBatches));
                }
            }

            console.log('✅ Finished processing all icons');

        } catch (error) {
            console.error('❌ Error during icon checking:', error.message);
            this.errors.push({
                type: 'PROCESSING_ERROR',
                message: error.message,
                stack: error.stack
            });
        }
    }

    /**
     * Generate and save reports
     */
    async generateReports() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportDir = path.join(__dirname, '..', '..', 'reports');

        try {
            await fs.mkdir(reportDir, { recursive: true });
        } catch (error) {
            // Directory might already exist
        }

        // Summary report
        const summary = {
            timestamp: new Date().toISOString(),
            totalIcons: this.totalCount,
            processedIcons: this.processedCount,
            workingUrls: this.workingUrls.length,
            brokenUrls: this.brokenUrls.length,
            errorRate: ((this.brokenUrls.length / this.processedCount) * 100).toFixed(2) + '%',
            errors: this.errors.length
        };

        // Save summary report
        const summaryPath = path.join(reportDir, `icon-validation-summary-${timestamp}.json`);
        await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
        console.log(`📊 Summary report saved: ${summaryPath}`);

        // Save detailed broken URLs report
        if (this.brokenUrls.length > 0) {
            const brokenUrlsPath = path.join(reportDir, `broken-icon-urls-${timestamp}.json`);
            await fs.writeFile(brokenUrlsPath, JSON.stringify(this.brokenUrls, null, 2));
            console.log(`🔴 Broken URLs report saved: ${brokenUrlsPath}`);

            // Also create a CSV version for easier viewing
            const csvPath = path.join(reportDir, `broken-icon-urls-${timestamp}.csv`);
            const csvHeader = 'Icon ID,Name,URL,Source,Is Verified,Usage Count,Status,Error\n';
            const csvRows = this.brokenUrls.map(icon =>
                `"${icon.iconId}","${icon.name}","${icon.url}","${icon.source}","${icon.isVerified}","${icon.usageCount}","${icon.status}","${icon.error || ''}"`
            ).join('\n');
            await fs.writeFile(csvPath, csvHeader + csvRows);
            console.log(`📄 CSV report saved: ${csvPath}`);
        }

        // Save working URLs report (optional - only if there are working URLs)
        if (this.workingUrls.length > 0) {
            const workingUrlsPath = path.join(reportDir, `working-icon-urls-${timestamp}.json`);
            await fs.writeFile(workingUrlsPath, JSON.stringify(this.workingUrls, null, 2));
            console.log(`✅ Working URLs report saved: ${workingUrlsPath}`);
        }

        return {
            summary,
            brokenUrlsCount: this.brokenUrls.length,
            workingUrlsCount: this.workingUrls.length,
            reportPaths: {
                summary: summaryPath,
                brokenUrls: this.brokenUrls.length > 0 ? path.join(reportDir, `broken-icon-urls-${timestamp}.json`) : null,
                csv: this.brokenUrls.length > 0 ? path.join(reportDir, `broken-icon-urls-${timestamp}.csv`) : null,
                workingUrls: this.workingUrls.length > 0 ? path.join(reportDir, `working-icon-urls-${timestamp}.json`) : null
            }
        };
    }

    /**
     * Print summary to console
     */
    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📋 ICON URL VALIDATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`📊 Total icons in database: ${this.totalCount}`);
        console.log(`✅ Icons processed: ${this.processedCount}`);
        console.log(`🟢 Working URLs: ${this.workingUrls.length}`);
        console.log(`🔴 Broken URLs (404s): ${this.brokenUrls.length}`);

        if (this.processedCount > 0) {
            const errorRate = ((this.brokenUrls.length / this.processedCount) * 100).toFixed(2);
            console.log(`📈 Error rate: ${errorRate}%`);
        }

        if (this.errors.length > 0) {
            console.log(`⚠️  Processing errors: ${this.errors.length}`);
        }

        console.log('='.repeat(60));

        if (this.brokenUrls.length > 0) {
            console.log('\n🔴 TOP 10 BROKEN URLS:');
            this.brokenUrls.slice(0, 10).forEach((icon, index) => {
                console.log(`${index + 1}. ${icon.iconId} (${icon.name}) - Status: ${icon.status}`);
                console.log(`   URL: ${icon.url}`);
                if (icon.error) {
                    console.log(`   Error: ${icon.error}`);
                }
                console.log('');
            });

            if (this.brokenUrls.length > 10) {
                console.log(`   ... and ${this.brokenUrls.length - 10} more broken URLs`);
            }
        }

        console.log('\n✅ Check completed! Reports have been saved to the reports/ directory.');
    }

    /**
     * Run the complete validation process
     */
    async run() {
        try {
            console.log('🚀 Starting Broken Icon URL Checker');
            console.log('=====================================');

            await this.connectToDatabase();
            await this.checkAllIcons();

            const reports = await this.generateReports();
            this.printSummary();

            return reports;

        } catch (error) {
            console.error('❌ Fatal error:', error.message);
            throw error;
        } finally {
            await mongoose.disconnect();
            console.log('🔌 Disconnected from MongoDB');
        }
    }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const checker = new BrokenIconChecker();

    // Handle command line arguments
    const args = process.argv.slice(2);
    if (args.includes('--batch-size')) {
        const batchSizeIndex = args.indexOf('--batch-size');
        if (batchSizeIndex + 1 < args.length) {
            checker.batchSize = parseInt(args[batchSizeIndex + 1]) || 10;
        }
    }

    if (args.includes('--delay')) {
        const delayIndex = args.indexOf('--delay');
        if (delayIndex + 1 < args.length) {
            checker.delayBetweenBatches = parseInt(args[delayIndex + 1]) || 1000;
        }
    }

    checker.run()
        .then((reports) => {
            console.log('\n🎉 Script completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Script failed:', error.message);
            process.exit(1);
        });
}

export default BrokenIconChecker;
