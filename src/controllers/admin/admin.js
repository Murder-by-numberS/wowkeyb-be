import Logger from '../../utils/logger.js';
import { validationResult } from 'express-validator';
import User from '../../models/user.js';
import Ability from '../../models/ability.js';
import Keybinding from '../../models/keybinding.js';
import Macro from '../../models/macro.js';
import Version from '../../models/version.js';
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

    // Get ticket stats from Jira
    let ticketStats = { total: 0, open: 0, recentlyCreated: 0, jiraDisabled: false };
    try {
      const projectKey = process.env.JIRA_PROJECT_KEY || 'WS';

      // Get all tickets count
      const allTickets = await jiraService.searchTickets(`project = ${projectKey}`, 1, 1);
      console.log('All tickets response:', JSON.stringify(allTickets.pagination));
      ticketStats.total = allTickets.pagination?.total_count || 0;

      // Get open tickets count (not Done/Closed)
      const openTickets = await jiraService.searchTickets(`project = ${projectKey} AND status NOT IN (Done, Closed)`, 1, 1);
      ticketStats.open = openTickets.pagination?.total_count || 0;

      // Get tickets created in last 7 days
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      const dateStr = last7Days.toISOString().split('T')[0];
      const recentTickets = await jiraService.searchTickets(`project = ${projectKey} AND created >= "${dateStr}"`, 1, 1);
      ticketStats.recentlyCreated = recentTickets.pagination?.total_count || 0;

      ticketStats.jiraDisabled = allTickets.jira_disabled || false;
      console.log('Final ticket stats:', ticketStats);
    } catch (ticketError) {
      Logger.warn('Could not fetch ticket stats from Jira:', ticketError.message);
      console.error('Ticket stats error:', ticketError);
      ticketStats.jiraDisabled = true;
    }

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
      },
      tickets: ticketStats
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
    const {
      page = 1,
      limit = 50,
      search = '',
      class: wowClass = '',
      spec = '',
      hero_talent = '',
      ability_type = '',
      version = '',
      sort = 'name',
      order = 'asc',
      includeInactive = 'true'
    } = req.query;

    // Build the actual filter query (for countDocuments which bypasses hooks)
    const filterQuery = {};
    if (search) {
      filterQuery.name = { $regex: search, $options: 'i' };
    }
    if (wowClass) {
      filterQuery.class = wowClass.toLowerCase();
    }
    if (spec) {
      filterQuery.spec = spec.toLowerCase();
    }
    if (hero_talent) {
      filterQuery.hero_talent = hero_talent;
    }
    if (ability_type) {
      filterQuery.ability_type = ability_type;
    }
    // Only filter by is_active if NOT including inactive
    if (includeInactive !== 'true') {
      filterQuery.is_active = true;
    }

    // Handle version filter - need to look up version ID
    if (version) {
      const versionDoc = await Version.findOne({ game_version: version });
      if (versionDoc) {
        filterQuery.game_version = versionDoc._id;
      }
    }

    // Build query for find() which uses the pre-find hook
    const findQuery = { ...filterQuery };
    if (includeInactive === 'true') {
      findQuery.includeInactive = true; // This tells the pre-find hook to skip is_active filter
    }

    // Build sort object
    const validSortFields = ['name', 'class', 'spec', 'ability_type', 'version'];
    const sortField = validSortFields.includes(sort) ? sort : 'name';
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortField]: sortOrder };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const abilities = await Ability.find(findQuery)
      .populate('game_version', 'game_version')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Use filterQuery for countDocuments (it bypasses pre-find hooks)
    const totalCount = await Ability.countDocuments(filterQuery);

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
 * Get all game versions for admin with ability counts
 */
export const getVersionsAdmin = async (req, res) => {
  try {
    const versions = await Version.find({}).sort({ game_version: -1 });

    // Sort by semantic version (newest first)
    const sortedVersions = versions.sort((a, b) => {
      const aParts = a.game_version.split('.').map(Number);
      const bParts = b.game_version.split('.').map(Number);

      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || 0;
        const bPart = bParts[i] || 0;
        if (aPart > bPart) return -1;
        if (aPart < bPart) return 1;
      }
      return 0;
    });

    // Get ability counts for each version
    const versionsWithCounts = await Promise.all(
      sortedVersions.map(async (v) => {
        const abilityCount = await Ability.countDocuments({ game_version: v._id });
        return {
          id: v._id,
          game_version: v.game_version,
          ability_count: abilityCount,
          created_at: v.createdAt
        };
      })
    );

    return res.status(200).json({
      versions: versionsWithCounts
    });
  } catch (error) {
    Logger.error('Error getting versions for admin:', error);
    return res.status(500).json({ message: 'Error getting versions' });
  }
};

/**
 * Create a new game version
 */
export const createVersion = async (req, res) => {
  try {
    const { game_version } = req.body;

    if (!game_version) {
      return res.status(400).json({ message: 'Game version is required' });
    }

    // Check if version already exists
    const existingVersion = await Version.findOne({ game_version });
    if (existingVersion) {
      return res.status(400).json({ message: 'Version already exists' });
    }

    // Validate version format (should be like X.Y.Z)
    const versionRegex = /^\d+\.\d+(\.\d+)?$/;
    if (!versionRegex.test(game_version)) {
      return res.status(400).json({ message: 'Invalid version format. Use format like 11.1.0 or 11.2' });
    }

    const newVersion = new Version({ game_version });
    await newVersion.save();

    Logger.info(`Admin created new version: ${game_version}`);

    return res.status(201).json({
      message: 'Version created successfully',
      version: {
        id: newVersion._id,
        game_version: newVersion.game_version,
        ability_count: 0,
        created_at: newVersion.createdAt
      }
    });
  } catch (error) {
    Logger.error('Error creating version:', error);
    return res.status(500).json({ message: 'Error creating version' });
  }
};

/**
 * Copy abilities from one version to another
 */
export const copyAbilitiesFromVersion = async (req, res) => {
  try {
    const { sourceVersionId, targetVersionId } = req.body;

    if (!sourceVersionId || !targetVersionId) {
      return res.status(400).json({ message: 'Source and target version IDs are required' });
    }

    // Verify both versions exist
    const sourceVersion = await Version.findById(sourceVersionId);
    const targetVersion = await Version.findById(targetVersionId);

    if (!sourceVersion) {
      return res.status(404).json({ message: 'Source version not found' });
    }
    if (!targetVersion) {
      return res.status(404).json({ message: 'Target version not found' });
    }

    // Check if target already has abilities
    const existingAbilities = await Ability.countDocuments({ game_version: targetVersionId });
    if (existingAbilities > 0) {
      return res.status(400).json({
        message: `Target version already has ${existingAbilities} abilities. Cannot copy to a version with existing abilities.`
      });
    }

    // Get all abilities from source version (including inactive)
    const sourceAbilities = await Ability.find({
      game_version: sourceVersionId,
      includeInactive: true
    });

    if (sourceAbilities.length === 0) {
      return res.status(400).json({ message: 'Source version has no abilities to copy' });
    }

    // Copy abilities to target version
    const copiedAbilities = sourceAbilities.map(ability => ({
      spell_id: ability.spell_id,
      name: ability.name,
      description: ability.description,
      icon: ability.icon,
      class: ability.class,
      spec: ability.spec,
      hero_talent: ability.hero_talent,
      ability_type: ability.ability_type,
      level_required: ability.level_required,
      cooldown: ability.cooldown,
      range: ability.range,
      cost: ability.cost,
      cost_amount: ability.cost_amount,
      is_active: ability.is_active,
      game_version: targetVersionId
    }));

    await Ability.insertMany(copiedAbilities);

    Logger.info(`Admin copied ${copiedAbilities.length} abilities from version ${sourceVersion.game_version} to ${targetVersion.game_version}`);

    return res.status(200).json({
      message: `Successfully copied ${copiedAbilities.length} abilities`,
      copied_count: copiedAbilities.length,
      source_version: sourceVersion.game_version,
      target_version: targetVersion.game_version
    });
  } catch (error) {
    Logger.error('Error copying abilities:', error);
    return res.status(500).json({ message: 'Error copying abilities' });
  }
};

/**
 * Delete a version (only if it has no abilities)
 */
export const deleteVersion = async (req, res) => {
  try {
    const { versionId } = req.params;

    const version = await Version.findById(versionId);
    if (!version) {
      return res.status(404).json({ message: 'Version not found' });
    }

    // Check if version has abilities
    const abilityCount = await Ability.countDocuments({ game_version: versionId });
    if (abilityCount > 0) {
      return res.status(400).json({
        message: `Cannot delete version with ${abilityCount} abilities. Delete or move abilities first.`
      });
    }

    await Version.findByIdAndDelete(versionId);

    Logger.info(`Admin deleted version: ${version.game_version}`);

    return res.status(200).json({
      message: 'Version deleted successfully'
    });
  } catch (error) {
    Logger.error('Error deleting version:', error);
    return res.status(500).json({ message: 'Error deleting version' });
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

    // Build filter query for countDocuments (real MongoDB fields only)
    const filterQuery = {};
    if (onlyDeleted === 'true') {
      filterQuery.deleted_at = { $ne: null };
    }
    if (search) {
      filterQuery.name = { $regex: search, $options: 'i' };
    }

    // Build find query (includes hook flags)
    const findQuery = { ...filterQuery };
    if (includeDeleted === 'true') {
      findQuery.includeDeleted = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const keybindings = await Keybinding.find(findQuery)
      .populate('user_id', 'username email')
      .populate('version', 'game_version')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Keybinding.countDocuments(filterQuery);

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
    const {
      page = 1,
      limit = 20,
      search = '',
      includeDeleted = 'true',
      onlyDeleted = 'false',
      startDate,
      endDate
    } = req.query;

    // Build filter query for countDocuments (real MongoDB fields only)
    const filterQuery = {};
    if (onlyDeleted === 'true') {
      filterQuery.deletedAt = { $ne: null };
    }

    // Search by name or username
    if (search) {
      // Find users matching the search term
      const matchingUsers = await User.find({
        username: { $regex: search, $options: 'i' }
      }).select('_id');
      const userIds = matchingUsers.map(u => u._id);

      // Search by macro name OR user_id
      filterQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { user_id: { $in: userIds } }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filterQuery.createdAt = {};
      if (startDate) {
        filterQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        filterQuery.createdAt.$lte = endOfDay;
      }
    }

    // Build find query (includes hook flags)
    const findQuery = { ...filterQuery };
    if (includeDeleted === 'true') {
      findQuery.includeDeleted = true;
      findQuery.includeInactive = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const macros = await Macro.find(findQuery)
      .populate('user_id', 'username email')
      .populate('game_version', 'game_version')
      .populate('ability', 'name icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Macro.countDocuments(filterQuery);

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
    const { status = 'all', priority = 'all', search = '', startDate, endDate, sortBy = 'priority', page = 1, limit = 20 } = req.query;

    // Get project key from environment or use default
    const projectKey = process.env.JIRA_PROJECT_KEY || 'WS';

    // Build JQL query
    let jqlParts = [`project = ${projectKey}`];

    if (status === 'active') {
      jqlParts.push(`status NOT IN (Done, Closed)`);
    } else if (status !== 'all') {
      jqlParts.push(`status = "${status}"`);
    }

    if (priority !== 'all') {
      jqlParts.push(`priority = "${priority}"`);
    }

    if (search && search.trim()) {
      // Search in summary and description
      jqlParts.push(`(summary ~ "${search}" OR description ~ "${search}" OR key = "${search.toUpperCase()}")`);
    }

    if (startDate) {
      jqlParts.push(`created >= "${startDate}"`);
    }

    if (endDate) {
      jqlParts.push(`created <= "${endDate}"`);
    }

    // Build ORDER BY clause based on sortBy parameter
    let orderBy;
    switch (sortBy) {
      case 'created_desc':
        orderBy = 'ORDER BY created DESC';
        break;
      case 'created_asc':
        orderBy = 'ORDER BY created ASC';
        break;
      case 'updated_desc':
        orderBy = 'ORDER BY updated DESC';
        break;
      case 'status':
        orderBy = 'ORDER BY status ASC, created DESC';
        break;
      case 'priority':
      default:
        orderBy = 'ORDER BY priority DESC, created DESC';
        break;
    }

    const jql = jqlParts.join(' AND ') + ' ' + orderBy;

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

/**
 * Add a comment to a support ticket
 */
export const addTicketComment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    const result = await jiraService.addComment(ticketId, comment);

    Logger.info(`Admin added comment to ticket ${ticketId}`);

    return res.status(200).json({ message: 'Comment added successfully', ...result });
  } catch (error) {
    Logger.error('Error adding comment to ticket:', error);
    return res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

/**
 * Get available transitions for a ticket
 */
export const getTicketTransitions = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const result = await jiraService.getTransitions(ticketId);

    return res.status(200).json(result);
  } catch (error) {
    Logger.error('Error getting ticket transitions:', error);
    return res.status(500).json({ message: 'Error getting transitions', error: error.message });
  }
};

/**
 * Transition a ticket to a new status
 */
export const transitionTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { transitionId } = req.body;

    if (!transitionId) {
      return res.status(400).json({ message: 'Transition ID is required' });
    }

    const result = await jiraService.transitionTicket(ticketId, transitionId);

    Logger.info(`Admin transitioned ticket ${ticketId} with transition ${transitionId}`);

    return res.status(200).json({ message: 'Ticket status updated successfully', ...result });
  } catch (error) {
    Logger.error('Error transitioning ticket:', error);
    return res.status(500).json({ message: 'Error updating ticket status', error: error.message });
  }
};
