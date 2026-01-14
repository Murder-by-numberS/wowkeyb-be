import mongoose from 'mongoose';
const { Schema } = mongoose;

// Generic model to track user files (uploads, downloads, exports) for any type of content
const fileSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    source: {
        type: String,
        enum: ['upload', 'generated'],
        required: true,
        default: 'generated'
    },
    download_type: {
        type: String,
        enum: ['macro_file', 'keybinding_export', 'profile_export', 'backup'],
        required: true
    },
    file_name: {
        type: String,
        required: true,
        trim: true
    },
    file_type: {
        type: String,
        enum: ['account', 'character', 'profile', 'backup', 'export'],
        required: false
    },
    s3_path: {
        type: String,
        required: true
    },
    cloudfront_url: {
        type: String,
        required: false
    },
    // For macro files
    macro_ids: [{
        type: Schema.Types.ObjectId,
        ref: 'Macro'
    }],
    // For keybinding exports
    keybinding_ids: [{
        type: Schema.Types.ObjectId,
        ref: 'Keybinding'
    }],
    // Generic item count
    item_count: {
        type: Number,
        default: 0
    },
    // Character-specific data
    character_class: {
        type: String,
        enum: [
            'deathknight',
            'demonhunter',
            'druid',
            'evoker',
            'hunter',
            'mage',
            'monk',
            'paladin',
            'priest',
            'rogue',
            'shaman',
            'warlock',
            'warrior',
            null
        ],
        default: null
    },
    character_name: {
        type: String,
        trim: true,
        default: null
    },
    // Metadata
    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    },
    // Download tracking
    downloaded_at: {
        type: Date,
        default: Date.now
    },
    download_count: {
        type: Number,
        default: 1
    },
    last_downloaded_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
fileSchema.index({ user_id: 1, downloaded_at: -1 });
fileSchema.index({ user_id: 1, source: 1, download_type: 1 });
fileSchema.index({ user_id: 1, download_type: 1 });
fileSchema.index({ user_id: 1, file_type: 1 });
fileSchema.index({ user_id: 1, character_class: 1 });
fileSchema.index({ s3_path: 1 });
fileSchema.index({ download_type: 1, user_id: 1 });

// Method to increment download count
fileSchema.methods.incrementDownloadCount = function () {
    this.download_count += 1;
    this.last_downloaded_at = new Date();
    return this.save();
};

// Static method to find user's files
fileSchema.statics.findUserFiles = function (userId, options = {}) {
    const query = { user_id: userId };

    if (options.download_type) {
        query.download_type = options.download_type;
    }

    if (options.file_type) {
        query.file_type = options.file_type;
    }

    if (options.character_class) {
        query.character_class = options.character_class;
    }

    let queryBuilder = this.find(query)
        .sort({ downloaded_at: -1 })
        .limit(options.limit || 50);

    // Conditionally populate based on download type
    if (!options.download_type || options.download_type === 'macro_file') {
        queryBuilder = queryBuilder.populate('macro_ids', 'name class spec');
    }

    if (!options.download_type || options.download_type === 'keybinding_export') {
        queryBuilder = queryBuilder.populate('keybinding_ids', 'name key_combination');
    }

    return queryBuilder;
};

// Static method to find files by type
fileSchema.statics.findByType = function (userId, downloadType, options = {}) {
    const query = {
        user_id: userId,
        download_type: downloadType
    };

    return this.find(query)
        .sort({ downloaded_at: -1 })
        .limit(options.limit || 50)
        .skip(options.skip || 0);
};

const File = mongoose.model('File', fileSchema);
export default File;

