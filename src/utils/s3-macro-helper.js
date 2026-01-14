import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../config/s3.js';
import Config from '../config/config.js';
import Logger from './logger.js';

/**
 * Upload a macro file to S3
 *
 * @param {string} fileName - The name of the file
 * @param {string} fileContent - The content of the file
 * @param {string} userId - The user ID for organizing files
 * @returns {Promise<Object>} Upload result with S3 path and CloudFront URL
 */
export const uploadMacroFileToS3 = async (fileName, fileContent, userId) => {
    try {
        const s3Key = `macro-files/${userId}/${Date.now()}-${fileName}`;
        const bucket = Config.filesBucket;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: s3Key,
            Body: fileContent,
            ContentType: 'text/plain',
            Metadata: {
                userId: userId,
                uploadedAt: new Date().toISOString()
            }
        });

        await s3Client.send(command);

        const cloudfrontUrl = Config.filesCloudfrontDomain
            ? `https://${Config.filesCloudfrontDomain}/${s3Key}`
            : null;

        Logger.info(`Uploaded macro file to S3: ${s3Key}`);

        return {
            s3_path: s3Key,
            cloudfront_url: cloudfrontUrl,
            file_name: fileName
        };
    } catch (error) {
        Logger.error('Error uploading macro file to S3:', error);
        throw new Error('Failed to upload macro file to S3');
    }
};

/**
 * Get a macro file from S3
 *
 * @param {string} s3Path - The S3 path/key of the file
 * @returns {Promise<string>} The file content
 */
export const getMacroFileFromS3 = async (s3Path) => {
    try {
        const bucket = Config.filesBucket;
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: s3Path
        });

        const response = await s3Client.send(command);
        const fileContent = await streamToString(response.Body);

        Logger.info(`Retrieved macro file from S3: ${s3Path}`);
        return fileContent;
    } catch (error) {
        Logger.error('Error getting macro file from S3:', error);
        throw new Error('Failed to retrieve macro file from S3');
    }
};

/**
 * Generate a presigned URL for downloading a macro file
 *
 * @param {string} s3Path - The S3 path/key of the file
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} The presigned URL
 */
export const getPresignedDownloadUrl = async (s3Path, expiresIn = 3600) => {
    try {
        const bucket = Config.filesBucket;
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: s3Path
        });

        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });

        Logger.info(`Generated presigned URL for: ${s3Path}`);
        return presignedUrl;
    } catch (error) {
        Logger.error('Error generating presigned URL:', error);
        throw new Error('Failed to generate download URL');
    }
};

/**
 * Helper function to convert stream to string
 *
 * @param {Stream} stream - The readable stream
 * @returns {Promise<string>} The string content
 */
const streamToString = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
};

/**
 * Upload a user-provided macro file (from file upload)
 *
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} originalFileName - The original file name
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Upload result
 */
export const uploadUserMacroFile = async (fileBuffer, originalFileName, userId) => {
    try {
        const timestamp = Date.now();
        const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const s3Key = `macro-files/${userId}/uploads/${timestamp}-${sanitizedFileName}`;
        const bucket = Config.filesBucket;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: s3Key,
            Body: fileBuffer,
            ContentType: 'text/plain',
            Metadata: {
                userId: userId,
                originalFileName: originalFileName,
                uploadedAt: new Date().toISOString()
            }
        });

        await s3Client.send(command);

        const cloudfrontUrl = Config.filesCloudfrontDomain
            ? `https://${Config.filesCloudfrontDomain}/${s3Key}`
            : null;

        Logger.info(`Uploaded user macro file to S3: ${s3Key}`);

        return {
            s3_path: s3Key,
            cloudfront_url: cloudfrontUrl,
            file_name: sanitizedFileName
        };
    } catch (error) {
        Logger.error('Error uploading user macro file to S3:', error);
        throw new Error('Failed to upload macro file to S3');
    }
};

