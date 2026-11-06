import mongoose from 'mongoose';
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { syncRetailWowVersion } from '../jobs/retailWowVersion.js';

const PARAMETER_NAME = process.env.DATABASE_URI_PARAMETER || '/wowkeyb-be/production/DATABASE_URI';

async function databaseUri() {
  if (process.env.DATABASE_URI) {
    return process.env.DATABASE_URI;
  }

  const client = new SSMClient({ region: process.env.AWS_REGION || 'us-east-1' });
  const result = await client.send(new GetParameterCommand({
    Name: PARAMETER_NAME,
    WithDecryption: true
  }));
  const value = result.Parameter?.Value;
  if (!value) {
    throw new Error(`Parameter ${PARAMETER_NAME} is empty`);
  }
  return value;
}

export const handler = async () => {
  const uri = await databaseUri();
  await mongoose.connect(uri);
  try {
    const result = await syncRetailWowVersion();
    console.log(JSON.stringify(result));
    return result;
  } finally {
    await mongoose.disconnect();
  }
};
