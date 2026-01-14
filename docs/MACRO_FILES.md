# WoW Macro File Upload/Download System

## Overview

This system allows users to upload, parse, generate, and download World of Warcraft macro cache files. The system supports both **account-wide** and **character-specific** macro files.

## WoW Macro File Format

### File Structure

WoW macro cache files use a specific text format:

```
VER 3 [hex_id] "[macro_name]" "[icon_fdid]"
[macro_line_1]
[macro_line_2]
...
END
VER 3 [hex_id] "[macro_name]" "[icon_fdid]"
[macro_line_1]
...
END
```

### Format Components

1. **VER 3** - Version identifier (always "VER 3")
2. **hex_id** - 16-character hexadecimal ID (e.g., `0100000000000001`)
3. **macro_name** - The name of the macro (in quotes)
4. **icon_fdid** - The File Data ID of the icon (in quotes)
5. **macro body** - The actual macro commands
6. **END** - Marker indicating the end of the macro

### Example

```
VER 3 0100000000000001 "Auto Judgement" "135959"
#showtooltip Judgment
/cast [harm] Judgment
/stopmacro [harm]
/targetenemy
/cast Judgment
/targetlasttarget
END
VER 3 0100000000000002 "Auto C Strike" "135891"
#showtooltip crusader strike
/cast [harm] crusader strike
/stopmacro [harm]
/targetenemy
/cast crusader strike
/targetlasttarget
END
```

## File Types

### Account-Wide Macros
- Can contain macros for any class
- Not restricted to specific class abilities
- File type: `account`

### Character-Specific Macros
- Should only contain macros for a specific class
- System validates that macros match the character's class
- File type: `character`
- Requires `character_class` parameter

## API Endpoints

### 1. Upload Macro File

**Endpoint:** `POST /api/files/upload`

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Parameters:**
- `file` (file) - The macro cache file (.txt)
- `file_type` (string) - Either "account" or "character"
- `character_class` (string, optional) - Required if file_type is "character". Valid values: paladin, priest, warrior, mage, warlock, hunter, rogue, druid, shaman, monk, deathknight, demonhunter, evoker
- `game_version` (string, optional) - MongoDB ID of game version (defaults to latest)
- `create_macros` (boolean, optional) - Whether to create macros in database (default: true)

**Example Request:**
```bash
curl -X POST "https://api.example.com/api/files/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@macros-cache-paladin.txt" \
  -F "file_type=character" \
  -F "character_class=paladin" \
  -F "create_macros=true"
```

**Response:**
```json
{
  "message": "Macro file uploaded successfully",
  "upload": {
    "id": "64f5a3b2c1234567890abcdef",
    "file_name": "macros-cache-paladin.txt",
    "file_type": "character",
    "character_class": "paladin",
    "s3_path": "macro-files/user123/uploads/1693234567-macros-cache-paladin.txt",
    "cloudfront_url": "https://cdn.example.com/macro-files/user123/uploads/1693234567-macros-cache-paladin.txt",
    "macros_parsed": 15,
    "macros_created": 15,
    "uploaded_at": "2024-10-26T12:34:56.789Z"
  },
  "validation": {
    "errors": [],
    "warnings": [],
    "isValid": true
  },
  "created_macros": [
    {
      "id": "64f5a3b2c1234567890abcd01",
      "name": "Auto Judgement",
      "class": "paladin",
      "macro_text": "#showtooltip Judgment\n/cast [harm] Judgment..."
    }
  ]
}
```

### 2. Generate Macro File

**Endpoint:** `POST /api/files/generate`

**Authentication:** Required

**Content-Type:** `application/json`

**Parameters:**
- `macro_ids` (array) - Array of macro MongoDB IDs to include
- `file_type` (string) - Either "account" or "character"
- `character_class` (string, optional) - Required if file_type is "character"
- `character_name` (string, optional) - Optional character name for filename
- `save_to_history` (boolean, optional) - Save to download history (default: true)

**Example Request:**
```bash
curl -X POST "https://api.example.com/api/files/generate" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "macro_ids": ["64f5a3b2c1234567890abcd01", "64f5a3b2c1234567890abcd02"],
    "file_type": "character",
    "character_class": "paladin",
    "character_name": "Mypaladin",
    "save_to_history": true
  }'
```

**Response:**
```json
{
  "message": "Macro file generated successfully",
  "file": {
    "id": "64f5a3b2c1234567890abcdef",
    "file_name": "macros-cache-Mypaladin-paladin-20241026.txt",
    "file_type": "character",
    "character_class": "paladin",
    "download_url": "https://s3.amazonaws.com/bucket/macro-files/user123/1693234567-macros-cache-Mypaladin-paladin-20241026.txt?X-Amz-Algorithm=...",
    "s3_path": "macro-files/user123/1693234567-macros-cache-Mypaladin-paladin-20241026.txt",
    "cloudfront_url": "https://cdn.example.com/macro-files/user123/1693234567-macros-cache-Mypaladin-paladin-20241026.txt",
    "macro_count": 15,
    "macros": [
      {
        "id": "64f5a3b2c1234567890abcd01",
        "name": "Auto Judgement",
        "class": "paladin"
      }
    ]
  }
}
```

### 3. Get Download History

**Endpoint:** `GET /api/files/history`

**Authentication:** Required

**Query Parameters:**
- `file_type` (string, optional) - Filter by "account" or "character"
- `character_class` (string, optional) - Filter by character class
- `limit` (number, optional) - Number of results per page (default: 50, max: 100)
- `page` (number, optional) - Page number (default: 1)

**Example Request:**
```bash
curl -X GET "https://api.example.com/api/files/history?file_type=character&character_class=paladin&limit=20&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "downloads": [
    {
      "id": "64f5a3b2c1234567890abcdef",
      "file_name": "macros-cache-paladin-20241026.txt",
      "file_type": "character",
      "character_class": "paladin",
      "character_name": "Mypaladin",
      "s3_path": "macro-files/user123/1693234567-macros-cache-paladin-20241026.txt",
      "cloudfront_url": "https://cdn.example.com/...",
      "macro_count": 15,
      "download_count": 3,
      "downloaded_at": "2024-10-26T12:34:56.789Z",
      "last_downloaded_at": "2024-10-26T14:22:11.123Z",
      "macros": [
        {
          "id": "64f5a3b2c1234567890abcd01",
          "name": "Auto Judgement",
          "class": "paladin"
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCount": 45,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 20
  }
}
```

### 4. Re-download Macro File

**Endpoint:** `GET /api/files/history/:id/download`

**Authentication:** Required

**Parameters:**
- `id` (path) - The download record MongoDB ID

**Example Request:**
```bash
curl -X GET "https://api.example.com/api/files/history/64f5a3b2c1234567890abcdef/download" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "message": "Download URL generated successfully",
  "file": {
    "id": "64f5a3b2c1234567890abcdef",
    "file_name": "macros-cache-paladin-20241026.txt",
    "file_type": "character",
    "character_class": "paladin",
    "download_url": "https://s3.amazonaws.com/bucket/macro-files/user123/1693234567-macros-cache-paladin-20241026.txt?X-Amz-Algorithm=...",
    "cloudfront_url": "https://cdn.example.com/...",
    "macro_count": 15,
    "download_count": 4
  }
}
```

### 5. Delete Download Record

**Endpoint:** `DELETE /api/files/history/:id`

**Authentication:** Required

**Parameters:**
- `id` (path) - The download record MongoDB ID

**Example Request:**
```bash
curl -X DELETE "https://api.example.com/api/files/history/64f5a3b2c1234567890abcdef" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "message": "Download record deleted successfully"
}
```

## Class Validation

When uploading a character-specific macro file, the system performs automatic class detection by analyzing the macro text for class-specific abilities and spells.

### Detected Classes

The system can detect macros for:
- Death Knight
- Demon Hunter
- Druid
- Evoker
- Hunter
- Mage
- Monk
- Paladin
- Priest
- Rogue
- Shaman
- Warlock
- Warrior

### Validation Rules

1. **Character-specific files** must only contain macros for the specified class
2. **Generic macros** (no class-specific abilities) are allowed in any file
3. **Account-wide files** can contain macros for any class
4. If a macro is detected as belonging to a different class than specified, the upload will be rejected

## Use Cases

### 1. Import Existing Macros
Upload your current WoW macro files to sync them with WowKeyb:
```bash
# Upload character macros
POST /api/macro-files/upload
- file: macros-cache.txt from WoW directory
- file_type: character
- character_class: paladin
```

### 2. Export Macros to WoW
Generate a file to use in World of Warcraft:
```bash
# Select macros and generate file
POST /api/macro-files/generate
- macro_ids: [list of macro IDs]
- file_type: character
- character_class: paladin

# Download the generated file and place it in:
# Windows: World of Warcraft\_retail_\WTF\Account\ACCOUNTNAME\
# Mac: Applications/World of Warcraft/_retail_/WTF/Account/ACCOUNTNAME/
```

### 3. Backup Macros
Keep a history of your macro exports:
```bash
# Generate with save_to_history: true
POST /api/macro-files/generate
- save_to_history: true

# View history
GET /api/macro-files/history

# Re-download previous versions
GET /api/macro-files/history/:id/download
```

## File Storage

- All uploaded and generated files are stored in AWS S3
- Files are organized by user ID and timestamp
- CloudFront URLs are generated for fast downloads
- Presigned URLs expire after 1 hour for security

## Error Handling

### Common Error Responses

**Invalid file type:**
```json
{
  "message": "Invalid file_type. Must be 'account' or 'character'"
}
```

**Class mismatch:**
```json
{
  "message": "Macro file contains macros for wrong class",
  "errors": [
    {
      "macroName": "Holy Word: Serenity",
      "message": "Macro 'Holy Word: Serenity' appears to be for priest, but file is for paladin",
      "detectedClass": "priest",
      "expectedClass": "paladin"
    }
  ]
}
```

**File too large:**
```json
{
  "message": "File size exceeds 2MB limit"
}
```

**No macros found:**
```json
{
  "message": "No macros found in file"
}
```

## Frontend Integration Notes

### File Upload Component
- Use `multipart/form-data` for file uploads
- Show file size limit (2MB)
- Accept only `.txt` files
- Display upload progress
- Show validation errors/warnings

### Macro Selection Component
- Display list of user's macros
- Add checkboxes for selection
- Filter by class for character-specific exports
- Show macro preview
- Generate button triggers file download

### Download History Component
- Display table/list of previous downloads
- Show download date, file type, class, macro count
- Provide re-download button
- Allow deletion of old records
- Pagination support

## Database Schema

### File Collection

The system uses a generic `File` model that can track different types of files (macro files, keybinding exports, profile exports, etc.).

```javascript
{
  user_id: ObjectId,
  source: 'upload' | 'generated',  // Distinguishes uploaded vs generated files
  download_type: 'macro_file' | 'keybinding_export' | 'profile_export' | 'backup',
  file_name: String,
  file_type: 'account' | 'character' | 'profile' | 'backup' | 'export',
  s3_path: String,
  cloudfront_url: String,

  // Type-specific references
  macro_ids: [ObjectId],           // For macro_file downloads
  keybinding_ids: [ObjectId],      // For keybinding_export downloads

  // Generic item count
  item_count: Number,

  // Character-specific data
  character_class: String,
  character_name: String,

  // Metadata for extensibility
  metadata: Mixed,

  // Download tracking
  downloaded_at: Date,
  download_count: Number,
  last_downloaded_at: Date
}
```

#### Download Types

- **`macro_file`** - WoW macro cache files (uses `macro_ids`)
- **`keybinding_export`** - Keybinding export files (uses `keybinding_ids`)
- **`profile_export`** - User profile exports
- **`backup`** - Full account backups

## Security Considerations

1. All endpoints require authentication
2. Users can only upload/download their own files
3. Presigned URLs expire after 1 hour
4. File size limited to 2MB
5. Only `.txt` files accepted
6. S3 files are organized by user ID to prevent access conflicts

