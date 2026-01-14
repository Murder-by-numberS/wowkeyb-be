# Generic Files Model

## Overview

The `File` model is a generic, extensible system for tracking user files (uploads, downloads, exports) across the entire WowKeyb platform. Instead of having separate models for each file type, we use a single unified model with type-specific fields.

## Benefits

✅ **Unified History** - All user downloads in one place
✅ **Consistent API** - Same patterns for all download types
✅ **Extensible** - Easy to add new download types
✅ **Efficient Queries** - Indexed by user and download type
✅ **Type-Safe** - Enum-based download types prevent errors

## Model Schema

```javascript
{
  // Core fields
  user_id: ObjectId,           // User who created the download
  download_type: String,       // Type of download (enum)
  file_name: String,           // Generated or uploaded filename
  file_type: String,           // Category of file (enum)
  s3_path: String,            // S3 storage location
  cloudfront_url: String,      // CDN URL (optional)

  // Type-specific references
  macro_ids: [ObjectId],       // For macro_file downloads
  keybinding_ids: [ObjectId],  // For keybinding_export downloads

  // Generic fields
  item_count: Number,          // Number of items in download
  character_class: String,     // For character-specific downloads
  character_name: String,      // Optional character identifier
  metadata: Mixed,             // Flexible metadata storage

  // Tracking
  downloaded_at: Date,         // First download timestamp
  download_count: Number,      // Re-download counter
  last_downloaded_at: Date,    // Most recent download

  // Timestamps
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

## Download Types

### Current Types

| Type | Description | Uses | Specific Fields |
|------|-------------|------|-----------------|
| `macro_file` | WoW macro cache files | `macro_ids` | `character_class`, `character_name` |
| `keybinding_export` | Keybinding exports | `keybinding_ids` | `character_class` |
| `profile_export` | User profile backups | - | `metadata` |
| `backup` | Full account backups | All IDs | `metadata` |

### Adding New File Types

To add a new file type:

1. **Update the enum in the model:**
   ```javascript
   download_type: {
     type: String,
     enum: ['macro_file', 'keybinding_export', 'profile_export', 'backup', 'NEW_TYPE'],
     required: true
   }
   ```

2. **Add type-specific fields if needed:**
   ```javascript
   new_type_ids: [{
     type: Schema.Types.ObjectId,
     ref: 'NewModel'
   }]
   ```

3. **Update the static method for population:**
   ```javascript
   if (!options.download_type || options.download_type === 'NEW_TYPE') {
     queryBuilder = queryBuilder.populate('new_type_ids', 'fields');
   }
   ```

## File Types

| Type | Use Case |
|------|----------|
| `account` | Account-wide files (any class) |
| `character` | Character-specific files (single class) |
| `profile` | User profile exports |
| `backup` | Full backups |
| `export` | Generic exports |

## Usage Examples

### Creating a File Record

```javascript
const file = new File({
  user_id: userId,
  download_type: 'macro_file',
  file_name: 'macros-cache-paladin-20241026.txt',
  file_type: 'character',
  s3_path: 's3://bucket/path/to/file.txt',
  cloudfront_url: 'https://cdn.example.com/file.txt',
  macro_ids: [macroId1, macroId2, macroId3],
  item_count: 3,
  character_class: 'paladin',
  character_name: 'Arthas'
});

await file.save();
```

### Querying Files

```javascript
// Get all macro files for a user
const macroFiles = await File.findUserFiles(userId, {
  download_type: 'macro_file',
  limit: 50
});

// Get character-specific files
const paladinFiles = await File.find({
  user_id: userId,
  download_type: 'macro_file',
  character_class: 'paladin'
});

// Get all files by type
const allMacros = await File.findByType(userId, 'macro_file', {
  limit: 100,
  skip: 0
});
```

### Re-downloading Files

```javascript
// Find the file record
const file = await File.findById(fileId);

// Increment the download counter
await file.incrementDownloadCount();

// Generate new presigned URL
const downloadUrl = await getPresignedDownloadUrl(file.s3_path);
```

## API Integration

### Generic Download Endpoints Pattern

```
GET    /api/{type}/downloads        - List downloads by type
POST   /api/{type}/generate          - Create new download
GET    /api/{type}/downloads/:id     - Get download details
GET    /api/{type}/downloads/:id/url - Get download URL
DELETE /api/{type}/downloads/:id     - Delete download record
```

### Example: Macro Files

```
GET    /api/macro-files/history
POST   /api/macro-files/generate
GET    /api/macro-files/history/:id/download
DELETE /api/macro-files/history/:id
```

### Example: Future Keybindings (when implemented)

```
GET    /api/keybindings/downloads
POST   /api/keybindings/export
GET    /api/keybindings/downloads/:id/url
DELETE /api/keybindings/downloads/:id
```

## Model Methods

### Instance Methods

#### `incrementDownloadCount()`
Increments the download counter and updates last download timestamp.

```javascript
await download.incrementDownloadCount();
```

### Static Methods

#### `findUserFiles(userId, options)`
Find files for a specific user with optional filters.

```javascript
const files = await File.findUserFiles('user123', {
  download_type: 'macro_file',
  file_type: 'character',
  character_class: 'paladin',
  limit: 50
});
```

#### `findByType(userId, downloadType, options)`
Find all files of a specific type for a user.

```javascript
const macros = await File.findByType('user123', 'macro_file', {
  limit: 20,
  skip: 0
});
```

## Indexes

The model has the following indexes for efficient queries:

```javascript
{ user_id: 1, downloaded_at: -1 }      // User's download history
{ user_id: 1, download_type: 1 }       // Downloads by type
{ user_id: 1, file_type: 1 }           // Downloads by file type
{ user_id: 1, character_class: 1 }     // Character-specific downloads
{ s3_path: 1 }                         // S3 path lookup
{ download_type: 1, user_id: 1 }       // Type-first queries
```

## Metadata Field

The `metadata` field is a flexible Mixed type for storing type-specific data:

```javascript
// Macro file metadata
metadata: {
  game_version: '11.0.5',
  total_characters: 1234,
  has_mouseover_macros: true
}

// Keybinding export metadata
metadata: {
  export_version: '2.0',
  keybind_count: 120,
  has_custom_keybinds: true
}

// Profile backup metadata
metadata: {
  backup_version: '1.0',
  included_data: ['macros', 'keybindings', 'settings'],
  backup_size_bytes: 12345
}
```

## Best Practices

### 1. Always Set download_type
```javascript
// ✅ Good
const file = new File({
  download_type: 'macro_file',
  // ...
});

// ❌ Bad - will fail validation
const file = new File({
  // download_type missing
});
```

### 2. Use Appropriate ID Arrays
```javascript
// ✅ Good - macro files use macro_ids
const file = new File({
  download_type: 'macro_file',
  macro_ids: [id1, id2, id3],
  item_count: 3
});

// ✅ Also good - keybinding files use keybinding_ids
const file = new File({
  download_type: 'keybinding_export',
  keybinding_ids: [id1, id2],
  item_count: 2
});
```

### 3. Populate Based on Type
```javascript
// ✅ Good - only populate what you need
const file = await File.findById(id)
  .populate('macro_ids', 'name class spec');

// ❌ Bad - populating wrong references
const file = await File.findById(id)
  .populate('keybinding_ids'); // Won't exist for macro_file type
```

### 4. Set item_count
Always set `item_count` to track the number of items in the file:

```javascript
const file = new File({
  macro_ids: macros.map(m => m._id),
  item_count: macros.length  // ✅ Explicitly set count
});
```

## Migration from Type-Specific Models

If you have existing type-specific file models (like the old `MacroDownload`), migrate by:

1. Add `download_type` field with appropriate value
2. Rename `macro_count` → `item_count` (or similar count fields)
3. Update all queries to include `download_type` filter
4. Update controllers to use generic `File` model

## Future Enhancements

Potential additions to the File model:

- **Expiration dates** - Auto-delete old files
- **Sharing** - Allow users to share files
- **Compression info** - Track file sizes and compression
- **Versioning** - Track multiple versions of the same export
- **Tags** - User-defined tags for organizing files

