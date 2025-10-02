import { Icon } from '../../models/index.js';
import IconValidator from '../../utils/icon-validator.js';
import Logger from '../../utils/logger.js';

/**
 * Get all icons with pagination and filtering
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getIcons = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            search = ''
        } = req.query;

        Logger.info('Icons API called with params:', { page, limit, search });

        const skip = (page - 1) * limit;
        const query = {};

        // Add search filter
        if (search) {
            const searchConditions = [
                { name: { $regex: search, $options: 'i' } },
                { keywords: { $regex: search, $options: 'i' } },
                { originalFileName: { $regex: search, $options: 'i' } }
            ];

            // Check if search term is numeric (potential FDID)
            const isNumeric = /^\d+$/.test(search);
            if (isNumeric) {
                searchConditions.push({ fdid: parseInt(search) });
            }

            query.$or = searchConditions;
        }

        Logger.info('Query object:', query);

        const icons = await Icon.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Icon.countDocuments(query);

        Logger.info(`Found ${icons.length} icons out of ${total} total`);

        res.json({
            success: true,
            icons: icons,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        Logger.error('Error fetching icons:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch icons',
            message: error.message
        });
    }
};

/**
 * Search icons using the model's search method
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const searchIcons = async (req, res) => {
    try {
        const {
            search = '',
            limit = 100,
            class: className = ''
        } = req.query;

        if (!search && !className) {
            return res.json({
                success: true,
                icons: [],
                total: 0
            });
        }

        let icons;
        if (className && !search) {
            // Search by class if no search term provided
            const classKeywords = [className.toLowerCase(), className];
            const query = {
                $or: [
                    { keywords: { $in: classKeywords } },
                    { name: { $regex: className, $options: 'i' } }
                ]
            };
            icons = await Icon.find(query).limit(parseInt(limit));
        } else {
            // Use the model's search method
            icons = await Icon.searchIcons(search, parseInt(limit));
        }

        res.json({
            success: true,
            icons: icons,
            total: icons.length
        });

    } catch (error) {
        Logger.error('Error searching icons:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search icons',
            message: error.message
        });
    }
};

/**
 * Get popular icons using the model's method
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getPopularIcons = async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        const icons = await Icon.getPopularIcons(parseInt(limit));

        res.json({
            success: true,
            icons: icons
        });

    } catch (error) {
        Logger.error('Error fetching popular icons:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch popular icons',
            message: error.message
        });
    }
};

/**
 * Get icon by original filename
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getIconByFilename = async (req, res) => {
    try {
        const { filename } = req.params;

        const icon = await Icon.findByOriginalFileName(filename);

        if (!icon) {
            return res.status(404).json({
                success: false,
                error: 'Icon not found'
            });
        }

        res.json({
            success: true,
            icon: icon
        });

    } catch (error) {
        Logger.error('Error fetching icon by filename:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch icon',
            message: error.message
        });
    }
};

/**
 * Get a specific icon by ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getIconById = async (req, res) => {
    try {
        const { id } = req.params;

        const icon = await Icon.findById(id);

        if (!icon) {
            return res.status(404).json({
                success: false,
                error: 'Icon not found'
            });
        }

        res.json({
            success: true,
            icon: icon
        });

    } catch (error) {
        Logger.error('Error fetching icon:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch icon',
            message: error.message
        });
    }
};

/**
 * Increment usage count for an icon
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const incrementIconUsage = async (req, res) => {
    try {
        const { id } = req.params;

        const icon = await Icon.findById(id);

        if (!icon) {
            return res.status(404).json({
                success: false,
                error: 'Icon not found'
            });
        }

        await icon.incrementUsage();

        res.json({
            success: true,
            icon: icon
        });

    } catch (error) {
        Logger.error('Error updating icon usage:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update icon usage',
            message: error.message
        });
    }
};

/**
 * Test endpoint to check if icons exist in database
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const testIcons = async (req, res) => {
    try {
        Logger.info('Testing icons collection...');

        // Get total count
        const totalCount = await Icon.countDocuments();
        Logger.info(`Total icons in database: ${totalCount}`);

        // Get a few sample icons
        const sampleIcons = await Icon.find().limit(5);
        Logger.info('Sample icons:', sampleIcons);

        res.json({
            success: true,
            totalCount,
            sampleIcons,
            collectionExists: totalCount > 0,
            message: `Found ${totalCount} icons in database`
        });

    } catch (error) {
        Logger.error('Error testing icons:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to test icons',
            message: error.message
        });
    }
};

/**
 * Validate and find working URLs for a specific icon ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const validateIcon = async (req, res) => {
    try {
        const { iconId } = req.params;
        Logger.info(`Validating icon: ${iconId}`);

        // Find all working URLs for this icon ID
        const workingUrls = await IconValidator.findAllWorkingIconUrls(iconId);

        // Also check if the icon exists in our database by name
        const dbIcon = await Icon.findOne({ name: iconId });

        res.json({
            success: true,
            iconId: iconId,
            workingUrls: workingUrls,
            totalWorkingUrls: workingUrls.length,
            inDatabase: !!dbIcon,
            dbIcon: dbIcon,
            message: workingUrls.length > 0
                ? `Found ${workingUrls.length} working URLs for ${iconId}`
                : `No working URLs found for ${iconId}`
        });

    } catch (error) {
        Logger.error('Error validating icon:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to validate icon',
            message: error.message
        });
    }
};

/**
 * Validate a specific icon URL
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const validateIconUrl = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL is required'
            });
        }

        Logger.info(`Validating URL: ${url}`);

        const validation = await IconValidator.validateIconUrl(url);

        res.json({
            success: true,
            validation: validation,
            message: validation.isValid
                ? `URL is valid and accessible`
                : `URL is not accessible or invalid format`
        });

    } catch (error) {
        Logger.error('Error validating URL:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to validate URL',
            message: error.message
        });
    }
};
