import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IntentConfig {
  private static cachedConfig: Map<string, any>;
  private static config: ConfigService;

  constructor(private config: ConfigService) {
    IntentConfig.cachedConfig = new Map<string, any>();
    IntentConfig.config = config;
  }

  get<T = any>(key: string): T {
    if (IntentConfig.cachedConfig.has(key))
      return IntentConfig.cachedConfig.get(key);
    const value = this.config.get<T>(key);
    IntentConfig.cachedConfig.set(key, value);
    return value;
  }

  static get<T = any>(key: string): T {
    if (this.cachedConfig.has(key)) return this.cachedConfig.get(key);
    const value = this.config.get<T>(key);
    this.cachedConfig.set(key, value);
    return value;
  }
}
