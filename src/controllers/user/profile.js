import Logger from '../../utils/logger.js';
import { User, Keybinding, Macro } from '../../models/index.js';
import { presentMany as presentKeybindings } from '../../presenters/keybindings.js';

/**
 * Get user profile by username
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        Logger.info(`Getting profile for username: ${username}`);

        // Find user by username
        const user = await User.findOne({ username })
            .select('username description favorite_class createdAt')
            .lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's public keybindings
        const keybindings = await Keybinding.find({
            user_id: user._id,
            is_public: true,
            deleted_at: null
        })
            .populate('version', 'game_version')
            .populate('user_id', 'username')
            .select('name class spec hero_talent version user_id createdAt duplication_count keybinds')
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        // Get user's public macros
        const macros = await Macro.find({
            user_id: user._id,
            is_public: true,
            is_active: true,
            deleted_at: null
        })
            .populate([
                { path: 'game_version', select: 'game_version' },
                { path: 'ability', select: 'name icon description' },
                { path: 'icon', select: '_id name cloudfrontUrl keywords' }
            ])
            .select('name description class spec hero_talent game_version ability show_tooltip macro_text icon tags usage_count createdAt')
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        // Transform macros for response
        const transformedMacros = macros.map(macro => ({
            id: macro._id,
            name: macro.name,
            description: macro.description,
            class: macro.class,
            spec: macro.spec,
            hero_talent: macro.hero_talent,
            game_version: macro.game_version,
            ability: macro.ability,
            show_tooltip: macro.show_tooltip,
            macro_text: macro.macro_text,
            icon: macro.icon,
            tags: macro.tags,
            usage_count: macro.usage_count,
            creator_username: user.username,
            created_at: macro.createdAt
        }));

        // Build response
        const profile = {
            username: user.username,
            description: user.description || '',
            favorite_class: user.favorite_class,
            created_at: user.createdAt,
            keybindings: presentKeybindings(keybindings),
            macros: transformedMacros,
            stats: {
                total_keybindings: keybindings.length,
                total_macros: macros.length
            }
        };

        Logger.info(`Profile for ${username} retrieved successfully`);
        return res.status(200).json(profile);
    } catch (error) {
        Logger.error('Error getting user profile:', error);
        return res.status(500).json({ message: 'Error retrieving user profile' });
    }
};

/**
 * Get user's public keybindings by username
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getUserKeybindings = async (req, res) => {
    try {
        const { username } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        Logger.info(`Getting keybindings for username: ${username}`);

        // Find user by username
        const user = await User.findOne({ username }).select('_id').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get total count
        const totalCount = await Keybinding.countDocuments({
            user_id: user._id,
            is_public: true,
            deleted_at: null
        });

        // Get user's public keybindings with pagination
        const keybindings = await Keybinding.find({
            user_id: user._id,
            is_public: true,
            deleted_at: null
        })
            .populate('version', 'game_version')
            .populate('user_id', 'username')
            .select('name class spec hero_talent version user_id createdAt duplication_count keybinds')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const totalPages = Math.ceil(totalCount / parseInt(limit));

        return res.status(200).json({
            keybindings: presentKeybindings(keybindings),
            pagination: {
                current_page: parseInt(page),
                total_pages: totalPages,
                total_count: totalCount,
                has_next_page: parseInt(page) < totalPages,
                has_prev_page: parseInt(page) > 1,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        Logger.error('Error getting user keybindings:', error);
        return res.status(500).json({ message: 'Error retrieving user keybindings' });
    }
};

/**
 * Get user's public macros by username
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getUserMacros = async (req, res) => {
    try {
        const { username } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        Logger.info(`Getting macros for username: ${username}`);

        // Find user by username
        const user = await User.findOne({ username }).select('_id').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get total count
        const totalCount = await Macro.countDocuments({
            user_id: user._id,
            is_public: true,
            is_active: true,
            deleted_at: null
        });

        // Get user's public macros with pagination
        const macros = await Macro.find({
            user_id: user._id,
            is_public: true,
            is_active: true,
            deleted_at: null
        })
            .populate([
                { path: 'game_version', select: 'game_version' },
                { path: 'ability', select: 'name icon description' },
                { path: 'icon', select: '_id name cloudfrontUrl keywords' }
            ])
            .select('name description class spec hero_talent game_version ability show_tooltip macro_text icon tags usage_count createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Transform macros for response
        const transformedMacros = macros.map(macro => ({
            id: macro._id,
            name: macro.name,
            description: macro.description,
            class: macro.class,
            spec: macro.spec,
            hero_talent: macro.hero_talent,
            game_version: macro.game_version,
            ability: macro.ability,
            show_tooltip: macro.show_tooltip,
            macro_text: macro.macro_text,
            icon: macro.icon,
            tags: macro.tags,
            usage_count: macro.usage_count,
            creator_username: user.username,
            created_at: macro.createdAt
        }));

        const totalPages = Math.ceil(totalCount / parseInt(limit));

        return res.status(200).json({
            macros: transformedMacros,
            pagination: {
                current_page: parseInt(page),
                total_pages: totalPages,
                total_count: totalCount,
                has_next_page: parseInt(page) < totalPages,
                has_prev_page: parseInt(page) > 1,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        Logger.error('Error getting user macros:', error);
        return res.status(500).json({ message: 'Error retrieving user macros' });
    }
};

