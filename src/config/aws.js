import { SESClient } from "@aws-sdk/client-ses";
import { S3Client } from "@aws-sdk/client-s3";
import Config from './config.js';

// Create SES client
const sesClient = new SESClient({
  credentials: {
    accessKeyId: Config.accessKey,
    secretAccessKey: Config.secretAccessKey,
  },
  region: Config.region,
});

// Create S3 client
const s3Client = new S3Client({
  credentials: {
    accessKeyId: Config.accessKey,
    secretAccessKey: Config.secretAccessKey,
  },
  region: Config.region,
});

export { sesClient, s3Client };
