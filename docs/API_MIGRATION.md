# API Migration Guide

## Breaking Changes - File Management API

### Overview

The macro file management API has been refactored for better clarity and extensibility. The changes include:

1. **Endpoint renaming**: `/api/macro-files` → `/api/files`
2. **New source field**: Files now track whether they were uploaded or generated
3. **Generic naming**: Better support for future file types (keybindings, profiles, etc.)

### URL Changes

| Old Endpoint | New Endpoint | Status |
|-------------|--------------|--------|
| `POST /api/macro-files/upload` | `POST /api/files/upload` | ✅ Active |
| `POST /api/macro-files/generate` | `POST /api/files/generate` | ✅ Active |
| `GET /api/macro-files/history` | `GET /api/files/history` | ✅ Active |
| `GET /api/macro-files/history/:id/download` | `GET /api/files/history/:id/download` | ✅ Active |
| `DELETE /api/macro-files/history/:id` | `DELETE /api/files/history/:id` | ✅ Active |

### New File Model Fields

#### `source` (New Field)

Files now include a `source` field to distinguish between uploaded and generated files:

```javascript
{
  source: 'upload' | 'generated',  // NEW FIELD
  download_type: 'macro_file' | 'keybinding_export' | 'profile_export' | 'backup',
  file_name: String,
  // ... other fields
}
```

**Values:**
- `upload` - File was uploaded by the user
- `generated` - File was generated from user's data

#### Example Response

```json
{
  "id": "64f5a3b2c1234567890abcdef",
  "source": "upload",
  "file_name": "macros-cache-paladin.txt",
  "file_type": "character",
  "character_class": "paladin",
  "download_type": "macro_file",
  // ... other fields
}
```

### Frontend Migration

Update your frontend API calls:

```typescript
// OLD
private baseUrl = `${environment.apiUrl}/macro-files`;

// NEW
private baseUrl = `${environment.apiUrl}/files`;
```

### Database Migration

The `downloads` collection has been renamed to `files`:

```javascript
// Old collection name
db.downloads

// New collection name
db.files
```

All existing documents will automatically include `source: 'generated'` as the default value for backward compatibility.

### Query Examples

#### Filter by source type

```javascript
// Get only uploaded files
GET /api/files/history?source=upload

// Get only generated files
GET /api/files/history?source=generated
```

#### Combined filters

```javascript
// Get uploaded macro files for paladin
GET /api/files/history?source=upload&file_type=character&character_class=paladin
```

### Migration Checklist

**Backend:**
- [x] Update route handlers from `/macro-files` to `/files`
- [x] Add `source` field to File model
- [x] Update controllers to set source on create
- [x] Update indexes to include source
- [x] Rename files: `macro-files.js` → `files.js`

**Frontend:**
- [x] Update API base URL in services
- [x] Handle new `source` field in responses
- [x] Update documentation

**Database:**
- [ ] Rename collection if needed (automatic via Mongoose)
- [ ] Existing documents work with default `source: 'generated'`

### Backward Compatibility

✅ **Existing data**: All existing documents will work with the default `source: 'generated'` value

✅ **API responses**: All previous response fields remain unchanged, with `source` added

⚠️ **Breaking change**: The URL endpoints have changed - frontend must update

### Testing

Test the migration:

```bash
# Test upload (should have source: 'upload')
curl -X POST http://localhost:1337/api/files/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@macros-cache.txt" \
  -F "file_type=character" \
  -F "character_class=paladin"

# Test generate (should have source: 'generated')
curl -X POST http://localhost:1337/api/files/generate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"macro_ids":["..."], "file_type":"character", "character_class":"paladin"}'

# Test history
curl -X GET "http://localhost:1337/api/files/history" \
  -H "Authorization: Bearer TOKEN"
```

### Support

For questions or issues with the migration, refer to:
- **API Documentation**: `/docs/MACRO_FILES.md`
- **Model Documentation**: `/docs/FILES_MODEL.md`

