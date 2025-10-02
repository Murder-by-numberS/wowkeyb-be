import axios from 'axios';

/**
 * Icon validation utility
 */
export class IconValidator {
    /**
     * Test if an icon URL is accessible
     * @param {string} url - The icon URL to test
     * @returns {Promise<boolean>} - True if the URL is accessible
     */
    static async testIconUrl(url) {
        try {
            const response = await axios.head(url, {
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    /**
     * Generate possible icon URLs for a given icon ID
     * @param {string} iconId - The icon ID
     * @returns {Array<string>} - Array of possible URLs
     */
    static generatePossibleUrls(iconId) {
        return [
            `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
            `https://wow.zamimg.com/images/wow/icons/medium/${iconId}.jpg`,
            `https://wow.zamimg.com/images/wow/icons/small/${iconId}.jpg`,
            `https://wow.zamimg.com/images/wow/icons/tiny/${iconId}.jpg`,
            `https://wow.zamimg.com/images/wow/icons/large/${iconId}.png`,
            `https://wow.zamimg.com/images/wow/icons/medium/${iconId}.png`,
            `https://wow.zamimg.com/images/wow/icons/small/${iconId}.png`,
            `https://wow.zamimg.com/images/wow/icons/tiny/${iconId}.png`
        ];
    }

    /**
     * Find the first working icon URL for a given icon ID
     * @param {string} iconId - The icon ID
     * @returns {Promise<string|null>} - The first working URL or null if none found
     */
    static async findWorkingIconUrl(iconId) {
        const possibleUrls = this.generatePossibleUrls(iconId);

        for (const url of possibleUrls) {
            if (await this.testIconUrl(url)) {
                return url;
            }
        }

        return null;
    }

    /**
     * Find all working icon URLs for a given icon ID
     * @param {string} iconId - The icon ID
     * @returns {Promise<Array<string>>} - Array of working URLs
     */
    static async findAllWorkingIconUrls(iconId) {
        const possibleUrls = this.generatePossibleUrls(iconId);
        const workingUrls = [];

        // Test all URLs in parallel
        const results = await Promise.allSettled(
            possibleUrls.map(url => this.testIconUrl(url))
        );

        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                workingUrls.push(possibleUrls[index]);
            }
        });

        return workingUrls;
    }

    /**
     * Extract icon ID from various URL patterns
     * @param {string} url - The URL to extract icon ID from
     * @returns {string|null} - The extracted icon ID or null if not found
     */
    static extractIconId(url) {
        const patterns = [
            /\/icons\/(?:large|medium|small|tiny)\/([a-zA-Z0-9_]+)\.(?:jpg|png|gif)$/i,
            /([a-zA-Z0-9_]+)\.(?:jpg|png|gif)$/i
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return null;
    }

    /**
     * Validate and normalize an icon URL
     * @param {string} url - The icon URL to validate
     * @returns {Promise<Object>} - Object with validation results
     */
    static async validateIconUrl(url) {
        const iconId = this.extractIconId(url);
        const isAccessible = await this.testIconUrl(url);

        return {
            url,
            iconId,
            isAccessible,
            isValid: isAccessible && iconId !== null
        };
    }
}

export default IconValidator;
