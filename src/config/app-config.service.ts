import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { decrypt } from '../common/utils/encryption.util';

@Injectable()
export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);
  private readonly envConfig: Record<string, string>;

  constructor() {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const envFileName = `${nodeEnv}.env`;
    const envCandidates = [
      path.resolve(process.cwd(), 'env', envFileName),
      path.resolve(process.cwd(), '.env'),
    ];

    let loaded = false;
    for (const filePath of envCandidates) {
      if (fs.existsSync(filePath)) {
        dotenv.config({ path: filePath });
        this.logger.log(`Loaded environment configuration from: ${filePath}`);
        loaded = true;
        break;
      }
    }

    if (!loaded) {
      dotenv.config();
      this.logger.warn(
        `Environment file for ${nodeEnv} not found directly, loaded default process environment`,
      );
    }

    this.envConfig = process.env as Record<string, string>;
  }

  get isEnvValuesEncrypted(): boolean {
    const value = (this.get('ENV_VALUES_ENCRYPTED') || 'true')
      .toLowerCase()
      .trim();
    return !['false', '0', 'no'].includes(value);
  }

  resolveSecret(value?: string): string {
    if (!value) {
      return '';
    }
    if (!this.isEnvValuesEncrypted) {
      return value;
    }
    try {
      return decrypt(value);
    } catch {
      return value;
    }
  }

  get port(): number {
    return Number(this.get('PORT')) || 3000;
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development' || this.nodeEnv === 'local';
  }

  get jwtSecret(): string {
    return this.get('JWT_SECRET') || 'defaultJwtSecret';
  }

  get senderEmail(): string {
    return this.resolveSecret(this.get('SENDER_EMAIL'));
  }

  get senderPassword(): string {
    return this.resolveSecret(this.get('SENDER_PASSWORD'));
  }

  get mongoConnectionUrl(): string {
    const directUrl = this.resolveSecret(this.get('MONGO_CONNECTION_URL'));
    if (directUrl) {
      return directUrl;
    }

    const mongoUrl = this.resolveSecret(this.get('MONGO_URL'));
    if (!mongoUrl) {
      throw new Error('Either MONGO_CONNECTION_URL or MONGO_URL is required in configuration');
    }

    const mongoPassword = this.resolveSecret(this.get('MONGO_PASSWORD'));
    if (mongoPassword) {
      return `mongodb+srv://${mongoPassword}@${mongoUrl}/blog?retryWrites=true&w=majority&appName=blogApi`;
    }

    if (
      mongoUrl.startsWith('mongodb://') ||
      mongoUrl.startsWith('mongodb+srv://')
    ) {
      return mongoUrl;
    }

    return `mongodb://${mongoUrl}`;
  }

  get(key: string): string | undefined {
    return this.envConfig[key] ?? process.env[key];
  }
}
