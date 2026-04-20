
import dotenv from 'dotenv';
import path from 'path';
import { IEvironment } from '../models/interfaces/common.interfaces';
import { decrypt } from '../services/encryptionService';

const envFilePath = path.resolve("env", `${process.env.NODE_ENV}.env`);

dotenv.config({ path: envFilePath });

const env = process.env as unknown as IEvironment

const isEnvValuesEncrypted = () => {
  const value = (env.ENV_VALUES_ENCRYPTED || 'true').toLowerCase().trim();
  return !['false', '0', 'no'].includes(value);
};

const resolveSecret = (value?: string) => {
  if (!value) {
    return '';
  }
  if (!isEnvValuesEncrypted()) {
    return value;
  }
  return decrypt(value);
};

const resolveMongoConnectionUrl = () => {
  const directUrl = resolveSecret(env.MONGO_CONNECTION_URL);
  if (directUrl) {
    return directUrl;
  }

  const mongoUrl = resolveSecret(env.MONGO_URL);
  if (!mongoUrl) {
    throw new Error('Either MONGO_CONNECTION_URL or MONGO_URL is required');
  }

  const mongoPassword = resolveSecret(env.MONGO_PASSWORD);
  if (mongoPassword) {
    return `mongodb+srv://${mongoPassword}@${mongoUrl}/blog?retryWrites=true&w=majority&appName=blogApi`;
  }

  if (mongoUrl.startsWith('mongodb://') || mongoUrl.startsWith('mongodb+srv://')) {
    return mongoUrl;
  }

  return `mongodb://${mongoUrl}`;
};

const MONGO_CONNECTION_URL = resolveMongoConnectionUrl();

const config = {
  PORT: env.PORT,
  MONGO_CONNECTION_URL,
  JWT_SECRET: env.JWT_SECRET,
  SENDER_EMAIL: resolveSecret(env.SENDER_EMAIL),
  SENDER_PASSWORD: resolveSecret(env.SENDER_PASSWORD),
  ENV_VALUES_ENCRYPTED: isEnvValuesEncrypted()
}


export default config