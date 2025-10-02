import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = express.Router();

/**
 * Scrape icons from Wago.tools
 * GET /api/wago-icons?page=1&search=icon
 */
router.get('/', async (req, res) => {
    try {
        const { page = 1, search = 'icon' } = req.query;
        const wagoUrl = `https://wago.tools/files?page=${page}&search=${search}`;

        console.log(`Scraping Wago.tools: ${wagoUrl}`);

        // Fetch the page from Wago.tools
        const response = await axios.get(wagoUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 10000
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const icons = [];

        // Look for icon URLs in various patterns
        $('img').each((index, element) => {
            const src = $(element).attr('src');
            if (src && src.includes('icon')) {
                // Extract icon ID from various URL patterns
                const iconIdMatch = src.match(/([a-zA-Z0-9_]+)\.(?:jpg|png|gif)$/i);
                if (iconIdMatch) {
                    const iconId = iconIdMatch[1];

                    // Try multiple URL patterns
                    const possibleUrls = [
                        `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                        `https://wow.zamimg.com/images/wow/icons/medium/${iconId}.jpg`,
                        `https://wow.zamimg.com/images/wow/icons/small/${iconId}.jpg`,
                        `https://wow.zamimg.com/images/wow/icons/tiny/${iconId}.jpg`,
                        src // Use the original URL if it's already a valid icon URL
                    ];

                    // Add all possible URLs
                    possibleUrls.forEach(url => {
                        if (!icons.some(icon => icon.url === url)) {
                            icons.push({
                                iconId: iconId,
                                url: url,
                                source: 'wago'
                            });
                        }
                    });
                }
            }
        });

        // Look for data attributes
        $('[data-icon]').each((index, element) => {
            const iconId = $(element).attr('data-icon');
            if (iconId) {
                // Try multiple URL patterns
                const possibleUrls = [
                    `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                    `https://wow.zamimg.com/images/wow/icons/medium/${iconId}.jpg`,
                    `https://wow.zamimg.com/images/wow/icons/small/${iconId}.jpg`,
                    `https://wow.zamimg.com/images/wow/icons/tiny/${iconId}.jpg`
                ];

                // Add all possible URLs
                possibleUrls.forEach(url => {
                    if (!icons.some(icon => icon.url === url)) {
                        icons.push({
                            iconId: iconId,
                            url: url,
                            source: 'wago'
                        });
                    }
                });
            }
        });

        // Look for background images in CSS
        $('[style*="background-image"]').each((index, element) => {
            const style = $(element).attr('style');
            const bgMatch = style.match(/url\(['"]?([^'")]+)['"]?\)/i);
            if (bgMatch && bgMatch[1].includes('icon')) {
                const iconIdMatch = bgMatch[1].match(/([a-zA-Z0-9_]+)\.(?:jpg|png|gif)$/i);
                if (iconIdMatch) {
                    const iconId = iconIdMatch[1];

                    // Try multiple URL patterns
                    const possibleUrls = [
                        `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                        `https://wow.zamimg.com/images/wow/icons/medium/${iconId}.jpg`,
                        `https://wow.zamimg.com/images/wow/icons/small/${iconId}.jpg`,
                        `https://wow.zamimg.com/images/wow/icons/tiny/${iconId}.jpg`,
                        bgMatch[1] // Use the original URL if it's already a valid icon URL
                    ];

                    // Add all possible URLs
                    possibleUrls.forEach(url => {
                        if (!icons.some(icon => icon.url === url)) {
                            icons.push({
                                iconId: iconId,
                                url: url,
                                source: 'wago'
                            });
                        }
                    });
                }
            }
        });

        // Look for script tags that might contain icon data
        $('script').each((index, element) => {
            const scriptContent = $(element).html();
            if (scriptContent && scriptContent.includes('icon')) {
                // Look for icon patterns in JavaScript
                const iconRegex = /(?:['"`])([a-zA-Z0-9_]+)\.(?:jpg|png|gif)(?:['"`])/gi;
                let match;
                while ((match = iconRegex.exec(scriptContent)) !== null) {
                    const iconId = match[1];

                    // Try multiple URL patterns
                    const possibleUrls = [
                        `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                        `https://wow.zamimg.com/images/wow/icons/medium/${iconId}.jpg`,
                        `https://wow.zamimg.com/images/wow/icons/small/${iconId}.jpg`,
                        `https://wow.zamimg.com/images/wow/icons/tiny/${iconId}.jpg`
                    ];

                    // Add all possible URLs
                    possibleUrls.forEach(url => {
                        if (!icons.some(icon => icon.url === url)) {
                            icons.push({
                                iconId: iconId,
                                url: url,
                                source: 'wago'
                            });
                        }
                    });
                }
            }
        });

        console.log(`Found ${icons.length} icons on page ${page}`);

        res.json({
            success: true,
            page: parseInt(page),
            icons: icons,
            total: icons.length,
            hasMore: icons.length > 0 // Simple heuristic
        });

    } catch (error) {
        console.error('Error scraping Wago.tools:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to scrape Wago.tools',
            message: error.message
        });
    }
});

/**
 * Get all icons from multiple pages
 * GET /api/wago-icons/all?maxPages=10
 */
router.get('/all', async (req, res) => {
    try {
        const { maxPages = 10 } = req.query;
        const allIcons = [];

        console.log(`Scraping all icons from Wago.tools (max ${maxPages} pages)...`);

        for (let page = 1; page <= maxPages; page++) {
            try {
                const response = await axios.get(`/api/wago-icons?page=${page}&search=icon`, {
                    baseURL: req.protocol + '://' + req.get('host')
                });

                if (response.data.success && response.data.icons.length > 0) {
                    allIcons.push(...response.data.icons);
                    console.log(`Page ${page}: ${response.data.icons.length} icons (Total: ${allIcons.length})`);
                } else {
                    console.log(`No icons found on page ${page}, stopping...`);
                    break;
                }

                // Add delay between requests
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.warn(`Failed to scrape page ${page}:`, error.message);
                break;
            }
        }

        // Remove duplicates
        const uniqueIcons = [...new Set(allIcons)];

        console.log(`Scraping complete. Found ${uniqueIcons.length} unique icons`);

        res.json({
            success: true,
            icons: uniqueIcons,
            total: uniqueIcons.length,
            pagesScraped: Math.min(page - 1, maxPages)
        });

    } catch (error) {
        console.error('Error scraping all icons:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to scrape all icons',
            message: error.message
        });
    }
});

/**
 * Search for a specific icon by ID
 * GET /api/wago-icons/search/:iconId
 */
router.get('/search/:iconId', async (req, res) => {
    try {
        const { iconId } = req.params;
        console.log(`Searching for icon: ${iconId}`);

        // Try to find the icon on Wago.tools
        const wagoUrl = `https://wago.tools/files?search=${iconId}`;
        console.log(`Searching Wago.tools: ${wagoUrl}`);

        const response = await axios.get(wagoUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 10000
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const foundIcons = [];

        // Look for the specific icon ID in various patterns
        $('img').each((index, element) => {
            const src = $(element).attr('src');
            if (src && src.includes(iconId)) {
                foundIcons.push({
                    iconId: iconId,
                    url: src,
                    source: 'wago',
                    element: 'img'
                });
            }
        });

        $('[data-icon]').each((index, element) => {
            const dataIcon = $(element).attr('data-icon');
            if (dataIcon && dataIcon.includes(iconId)) {
                foundIcons.push({
                    iconId: dataIcon,
                    url: `https://wow.zamimg.com/images/wow/icons/large/${dataIcon}.jpg`,
                    source: 'wago',
                    element: 'data-icon'
                });
            }
        });

        // Also try different URL patterns for the icon
        const possibleUrls = [
            `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
            `https://wow.zamimg.com/images/wow/icons/medium/${iconId}.jpg`,
            `https://wow.zamimg.com/images/wow/icons/small/${iconId}.jpg`,
            `https://wow.zamimg.com/images/wow/icons/tiny/${iconId}.jpg`
        ];

        // Test each URL to see if it exists
        for (const url of possibleUrls) {
            try {
                const testResponse = await axios.head(url, { timeout: 5000 });
                if (testResponse.status === 200) {
                    foundIcons.push({
                        iconId: iconId,
                        url: url,
                        source: 'direct',
                        element: 'url-test'
                    });
                }
            } catch (error) {
                // URL doesn't exist, continue
            }
        }

        console.log(`Found ${foundIcons.length} icons for ${iconId}`);

        res.json({
            success: true,
            iconId: iconId,
            icons: foundIcons,
            total: foundIcons.length,
            searchUrl: wagoUrl
        });

    } catch (error) {
        console.error('Error searching for specific icon:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search for icon',
            message: error.message
        });
    }
});

export default router;
