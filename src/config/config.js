import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const appConfig = require('../../package.json');

const Config = {

  nodeEnv: (process.env.NODE_ENV || 'development'),
  appEnv: process.env.APP_ENV,
  appName: appConfig.name,
  appPort: (process.env.APP_PORT || process.env.PORT || 1337),
  appURL: process.env.APP_URL || 'http://localhost:1337',
  appVersion: appConfig.version,
  // appSecretKey: process.env.SECRET_KEY,
  logLevel: process.env.LOG_LEVEL || 'info',

  feURL: process.env.FE_URL || 'http://localhost:4200',

  //mongodb
  databaseURI: process.env.DATABASE_URI,

  //AWS
  accessKey: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_S3_BUCKET_NAME,
  filesBucket: process.env.AWS_S3_FILES_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME, // Fallback to main bucket if not specified
  s3Path: process.env.AWS_S3_PATH,
  cloudfrontDomain: process.env.CLOUDFRONT_DOMAIN,
  filesCloudfrontDomain: process.env.FILES_CLOUDFRONT_DOMAIN || process.env.CLOUDFRONT_DOMAIN, // Fallback to main CloudFront if not specified

}

export default Config;
