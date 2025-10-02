# Icon Processing Setup Guide

This guide explains how to set up and use the icon processing system for WoW icons.

## Prerequisites

1. **Environment Variables**: Make sure you have the following environment variables set:
   ```bash
   # Existing AWS variables
   AWS_KEY=your_access_key
   AWS_SECRET_KEY=your_secret_key
   AWS_REGION=your_region
   AWS_S3_BUCKET_NAME=your_bucket_name

   # New CloudFront variable
   CLOUDFRONT_DOMAIN=your_cloudfront_domain.cloudfront.net

   # MongoDB
   DATABASE_URI=your_mongodb_connection_string
   ```

2. **S3 Bucket**: Your S3 bucket should be configured with:
   - Public read access for the `icons/` folder
   - CloudFront distribution pointing to the bucket
   - CORS configuration for web access

3. **Icon Files**: Place your icon PNG files in the directory:
   ```
   /Users/loganborn/Downloads/blpconvert-1.0/wow_icons/interface/icons_png/
   ```

## Scripts

### 1. Test Script (Recommended First Step)
```bash
# For development environment
npm run test-icon-processing:dev

# For staging environment
npm run test-icon-processing:staging

# For production environment
npm run test-icon-processing:prod
```
This script processes a single icon file to test your setup before running the full batch.

### 2. Full Processing Script
```bash
# For development environment
npm run process-icons:dev

# For staging environment
npm run process-icons:staging

# For production environment
npm run process-icons:prod
```
This script processes all PNG files in the icons directory.

## Icon Model Schema

The updated Icon model includes these new fields:
- `s3Path`: The S3 key/path where the image is stored
- `cloudfrontUrl`: The CloudFront URL for accessing the image
- `originalFileName`: The original filename from the source directory

## Features

### Automatic Name Generation
- Converts filenames like `ability_deathknight_boneshield.png` to "Deathknight Boneshield"
- Handles special cases like "Death Knight" and "Demon Hunter"

### Smart Keyword Extraction
- Extracts meaningful keywords from filenames
- Adds class-specific keywords (deathknight, demonhunter, etc.)
- Removes common prefixes like "ability_", "boss_", etc.

### Batch Processing
- Processes files in batches of 10 to avoid overwhelming the system
- Includes delays between batches
- Skips files that have already been processed

### S3 Optimization
- Sets appropriate cache headers (1 year)
- Stores files in organized folder structure (`icons/filename.png`)
- Includes metadata for tracking

## Usage Examples

### Search Icons
```javascript
// Search by name or keywords
const icons = await Icon.searchIcons('death knight', 20);

// Get popular icons
const popular = await Icon.getPopularIcons(10);

// Find by original filename
const icon = await Icon.findByOriginalFileName('ability_deathknight_boneshield.png');
```

### Increment Usage
```javascript
const icon = await Icon.findOne({ name: 'Deathknight Boneshield' });
await icon.incrementUsage();
```

## Troubleshooting

### Common Issues

1. **S3 Upload Errors**: Check your AWS credentials and bucket permissions
2. **CloudFront Not Working**: Verify the CLOUDFRONT_DOMAIN environment variable
3. **Database Connection**: Ensure MongoDB is running and DATABASE_URI is correct
4. **File Not Found**: Check that the icons directory path is correct

### Logs
The scripts provide detailed logging to help identify issues:
- ✓ indicates successful operations
- Error messages include specific details about failures
- Batch progress is shown for the full processing script

### Environment Files
Make sure you have the appropriate environment files:
- `.env.development` for development
- `.env.staging` for staging
- `.env.production` for production

Each file should contain all the required environment variables listed above.

## Performance Considerations

- The full script processes ~1000+ icons in batches
- Each batch of 10 files takes approximately 30-60 seconds
- Total processing time: 1-2 hours for the complete set
- Memory usage is optimized by processing in small batches

## Next Steps

After running the processing script:
1. Verify icons are accessible via CloudFront URLs
2. Test the search functionality in your application
3. Consider implementing icon caching on the frontend
4. Set up monitoring for S3 and CloudFront usage
