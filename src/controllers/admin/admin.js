import Logger from '../../utils/logger.js';
import { validationResult } from 'express-validator';
import User from '../../models/user.js';
import Ability from '../../models/ability.js';
import Keybinding from '../../models/keybinding.js';
import Macro from '../../models/macro.js';
import jiraService from '../../services/jira.service.js';

// ==================== DASHBOARD STATS ====================

/**
 * Get admin dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAbilities,
      activeAbilities,
      totalKeybindings,
      deletedKeybindings,
      totalMacros,
      deletedMacros
    ] = await Promise.all([
      User.countDocuments(),
      Ability.countDocuments({}), // Count all abilities (countDocuments bypasses pre-find hooks)
      Ability.countDocuments({ is_active: true }),
      Keybinding.countDocuments({}), // Count all keybindings
      Keybinding.countDocuments({ deleted_at: { $ne: null } }),
      Macro.countDocuments({}), // Count all macros
      Macro.countDocuments({ deletedAt: { $ne: null } })
    ]);

    // Count admin users
    const adminUsers = await User.countDocuments({ access_level: { $gte: 9 } });

    return res.status(200).json({
      users: {
        total: totalUsers,
        admins: adminUsers
      },
      abilities: {
        total: totalAbilities,
        active: activeAbilities,
        inactive: totalAbilities - activeAbilities
      },
      keybindings: {
        total: totalKeybindings,
        active: totalKeybindings - deletedKeybindings,
        deleted: deletedKeybindings
      },
      macros: {
        total: totalMacros,
        active: totalMacros - deletedMacros,
        deleted: deletedMacros
      }
    });
  } catch (error) {
    Logger.error('Error getting dashboard stats:', error);
    return res.status(500).json({ message: 'Error getting dashboard stats' });
  }
};

// ==================== USER MANAGEMENT ====================

/**
 * Get all users with pagination
 */
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, totalCount] = await Promise.all([
      User.find(query)
        .select('-encrypted_password -confirm_code -reset_code')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    return res.status(200).json({
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        confirmed: user.confirmed,
        access_level: user.access_level,
        description: user.description,
        favorite_class: user.favorite_class,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      })),
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalCount / parseInt(limit)),
        total_count: totalCount,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    Logger.error('Error getting users:', error);
    return res.status(500).json({ message: 'Error getting users' });
  }
};

/**
 * Update user access level
 */
export const updateUserAccessLevel = async (req, res) => {
  try {
    const { userId } = req.params;
    const { access_level } = req.body;

    if (access_level === undefined || access_level < 1 || access_level > 9) {
      return res.status(400).json({ message: 'Invalid access level. Must be between 1 and 9.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent demoting yourself
    if (userId === req.decoded.user_id && access_level < 9) {
      return res.status(400).json({ message: 'You cannot demote yourself from admin' });
    }

    const previousLevel = user.access_level;
    user.access_level = access_level;
    await user.save();

    Logger.info(`Admin ${req.user.username} changed user ${user.username} access_level from ${previousLevel} to ${access_level}`);

    return res.status(200).json({
      message: 'User access level updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        access_level: user.access_level
      }
    });
  } catch (error) {
    Logger.error('Error updating user access level:', error);
    return res.status(500).json({ message: 'Error updating user access level' });
  }
};

/**
 * Get single user details
 */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-encrypted_password -confirm_code -reset_code');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's keybinding and macro counts (countDocuments bypasses pre-find hooks)
    const [keybindingCount, macroCount] = await Promise.all([
      Keybinding.countDocuments({ user_id: userId }),
      Macro.countDocuments({ user_id: userId })
    ]);

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        confirmed: user.confirmed,
        access_level: user.access_level,
        description: user.description,
        favorite_class: user.favorite_class,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        stats: {
          keybindings: keybindingCount,
          macros: macroCount
        }
      }
    });
  } catch (error) {
    Logger.error('Error getting user by ID:', error);
    return res.status(500).json({ message: 'Error getting user' });
  }
};

// ==================== ABILITIES MANAGEMENT ====================

/**
 * Get all abilities with pagination (including inactive)
 */
export const getAbilitiesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '', class: wowClass = '', includeInactive = 'true' } = req.query;

    const query = {};
    if (includeInactive === 'true') {
      query.includeInactive = true;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (wowClass) {
      query.class = wowClass.toLowerCase();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Need to use aggregation to bypass the pre-find middleware
    const abilities = await Ability.find(query)
      .populate('game_version', 'game_version')
      .sort({ class: 1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Ability.countDocuments(query);

    return res.status(200).json({
      abilities: abilities.map(ability => ({
        id: ability._id,
        spell_id: ability.spell_id,
        name: ability.name,
        description: ability.description,
        icon: ability.icon,
        class: ability.class,
        spec: ability.spec,
        hero_talent: ability.hero_talent,
        ability_type: ability.ability_type,
        is_active: ability.is_active,
        level_required: ability.level_required,
        cooldown: ability.cooldown,
        range: ability.range,
        cost: ability.cost,
        cost_amount: ability.cost_amount,
        game_version: ability.game_version?.game_version
      })),
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalCount / parseInt(limit)),
        total_count: totalCount,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    Logger.error('Error getting abilities for admin:', error);
    return res.status(500).json({ message: 'Error getting abilities' });
  }
};

/**
 * Toggle ability active status
 */
export const toggleAbilityActive = async (req, res) => {
  try {
    const { abilityId } = req.params;

    const ability = await Ability.findById(abilityId);
    if (!ability) {
      return res.status(404).json({ message: 'Ability not found' });
    }

    ability.is_active = !ability.is_active;
    await ability.save();

    Logger.info(`Admin ${req.user.username} ${ability.is_active ? 'activated' : 'deactivated'} ability: ${ability.name}`);

    return res.status(200).json({
      message: `Ability ${ability.is_active ? 'activated' : 'deactivated'} successfully`,
      ability: {
        id: ability._id,
        name: ability.name,
        is_active: ability.is_active
      }
    });
  } catch (error) {
    Logger.error('Error toggling ability active status:', error);
    return res.status(500).json({ message: 'Error updating ability' });
  }
};

// ==================== KEYBINDINGS MANAGEMENT ====================

/**
 * Get all keybindings with pagination (including deleted)
 */
export const getKeybindingsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', includeDeleted = 'true', onlyDeleted = 'false' } = req.query;

    const query = {};
    if (includeDeleted === 'true') {
      query.includeDeleted = true;
    }
    if (onlyDeleted === 'true') {
      query.deleted_at = { $ne: null };
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const keybindings = await Keybinding.find(query)
      .populate('user_id', 'username email')
      .populate('version', 'game_version')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Keybinding.countDocuments(query);

    return res.status(200).json({
      keybindings: keybindings.map(kb => ({
        id: kb._id,
        name: kb.name,
        class: kb.class,
        spec: kb.spec,
        hero_talent: kb.hero_talent,
        is_public: kb.is_public,
        keybind_count: kb.keybinds?.length || 0,
        duplication_count: kb.duplication_count,
        deleted_at: kb.deleted_at,
        is_deleted: !!kb.deleted_at,
        user: kb.user_id ? {
          id: kb.user_id._id,
          username: kb.user_id.username,
          email: kb.user_id.email
        } : null,
        version: kb.version?.game_version,
        created_at: kb.createdAt,
        updated_at: kb.updatedAt
      })),
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalCount / parseInt(limit)),
        total_count: totalCount,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    Logger.error('Error getting keybindings for admin:', error);
    return res.status(500).json({ message: 'Error getting keybindings' });
  }
};

/**
 * Restore a soft-deleted keybinding
 */
export const restoreKeybinding = async (req, res) => {
  try {
    const { keybindingId } = req.params;

    const keybinding = await Keybinding.findOne({ _id: keybindingId, includeDeleted: true });
    if (!keybinding) {
      return res.status(404).json({ message: 'Keybinding not found' });
    }

    if (!keybinding.deleted_at) {
      return res.status(400).json({ message: 'Keybinding is not deleted' });
    }

    keybinding.deleted_at = null;
    await keybinding.save();

    Logger.info(`Admin ${req.user.username} restored keybinding: ${keybinding.name} (${keybindingId})`);

    return res.status(200).json({
      message: 'Keybinding restored successfully',
      keybinding: {
        id: keybinding._id,
        name: keybinding.name,
        deleted_at: keybinding.deleted_at
      }
    });
  } catch (error) {
    Logger.error('Error restoring keybinding:', error);
    return res.status(500).json({ message: 'Error restoring keybinding' });
  }
};

/**
 * Permanently delete a keybinding
 */
export const permanentDeleteKeybinding = async (req, res) => {
  try {
    const { keybindingId } = req.params;

    const keybinding = await Keybinding.findOne({ _id: keybindingId, includeDeleted: true });
    if (!keybinding) {
      return res.status(404).json({ message: 'Keybinding not found' });
    }

    await Keybinding.deleteOne({ _id: keybindingId });

    Logger.info(`Admin ${req.user.username} permanently deleted keybinding: ${keybinding.name} (${keybindingId})`);

    return res.status(200).json({
      message: 'Keybinding permanently deleted'
    });
  } catch (error) {
    Logger.error('Error permanently deleting keybinding:', error);
    return res.status(500).json({ message: 'Error deleting keybinding' });
  }
};

// ==================== MACROS MANAGEMENT ====================

/**
 * Get all macros with pagination (including deleted)
 */
export const getMacrosAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', includeDeleted = 'true', onlyDeleted = 'false' } = req.query;

    const query = {};
    if (includeDeleted === 'true') {
      query.includeDeleted = true;
      query.includeInactive = true;
    }
    if (onlyDeleted === 'true') {
      query.deletedAt = { $ne: null };
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const macros = await Macro.find(query)
      .populate('user_id', 'username email')
      .populate('game_version', 'game_version')
      .populate('ability', 'name icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Macro.countDocuments(query);

    return res.status(200).json({
      macros: macros.map(macro => ({
        id: macro._id,
        name: macro.name,
        description: macro.description,
        class: macro.class,
        spec: macro.spec,
        hero_talent: macro.hero_talent,
        macro_text: macro.macro_text,
        is_active: macro.is_active,
        is_public: macro.is_public,
        usage_count: macro.usage_count,
        tags: macro.tags,
        deleted_at: macro.deletedAt,
        is_deleted: !!macro.deletedAt,
        user: macro.user_id ? {
          id: macro.user_id._id,
          username: macro.user_id.username,
          email: macro.user_id.email
        } : null,
        ability: macro.ability ? {
          id: macro.ability._id,
          name: macro.ability.name,
          icon: macro.ability.icon
        } : null,
        game_version: macro.game_version?.game_version,
        created_at: macro.createdAt,
        updated_at: macro.updatedAt
      })),
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalCount / parseInt(limit)),
        total_count: totalCount,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    Logger.error('Error getting macros for admin:', error);
    return res.status(500).json({ message: 'Error getting macros' });
  }
};

/**
 * Restore a soft-deleted macro
 */
export const restoreMacro = async (req, res) => {
  try {
    const { macroId } = req.params;

    const macro = await Macro.findOne({ _id: macroId, includeDeleted: true, includeInactive: true });
    if (!macro) {
      return res.status(404).json({ message: 'Macro not found' });
    }

    if (!macro.deletedAt) {
      return res.status(400).json({ message: 'Macro is not deleted' });
    }

    // Use the restore method defined on the schema
    await macro.restore();

    Logger.info(`Admin ${req.user.username} restored macro: ${macro.name} (${macroId})`);

    return res.status(200).json({
      message: 'Macro restored successfully',
      macro: {
        id: macro._id,
        name: macro.name,
        is_active: macro.is_active,
        deleted_at: macro.deletedAt
      }
    });
  } catch (error) {
    Logger.error('Error restoring macro:', error);
    return res.status(500).json({ message: 'Error restoring macro' });
  }
};

/**
 * Permanently delete a macro
 */
export const permanentDeleteMacro = async (req, res) => {
  try {
    const { macroId } = req.params;

    const macro = await Macro.findOne({ _id: macroId, includeDeleted: true, includeInactive: true });
    if (!macro) {
      return res.status(404).json({ message: 'Macro not found' });
    }

    await Macro.deleteOne({ _id: macroId });

    Logger.info(`Admin ${req.user.username} permanently deleted macro: ${macro.name} (${macroId})`);

    return res.status(200).json({
      message: 'Macro permanently deleted'
    });
  } catch (error) {
    Logger.error('Error permanently deleting macro:', error);
    return res.status(500).json({ message: 'Error deleting macro' });
  }
};

// ==================== SUPPORT TICKETS ====================

/**
 * Get support tickets from Jira
 */
export const getSupportTickets = async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;

    // Build JQL query
    let jql = 'project = WOW'; // Assuming WOW is the Jira project key
    if (status !== 'all') {
      jql += ` AND status = "${status}"`;
    }
    jql += ' ORDER BY created DESC';

    const tickets = await jiraService.searchTickets(jql, parseInt(page), parseInt(limit));

    return res.status(200).json(tickets);
  } catch (error) {
    Logger.error('Error getting support tickets:', error);
    return res.status(500).json({ message: 'Error getting support tickets', error: error.message });
  }
};

/**
 * Get single support ticket details
 */
export const getSupportTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await jiraService.getTicket(ticketId);

    return res.status(200).json(ticket);
  } catch (error) {
    Logger.error('Error getting support ticket:', error);
    return res.status(500).json({ message: 'Error getting support ticket', error: error.message });
  }
};
