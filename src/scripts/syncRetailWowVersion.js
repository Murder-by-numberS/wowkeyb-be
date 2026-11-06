import mongoose from 'mongoose';
import { pathToFileURL } from 'url';
import Config from '../config/config.js';
import { syncRetailWowVersion } from '../jobs/retailWowVersion.js';

async function main() {
  if (!Config.databaseURI) {
    throw new Error('DATABASE_URI is required');
  }

  await mongoose.connect(Config.databaseURI);
  try {
    const result = await syncRetailWowVersion();
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await mongoose.disconnect();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
