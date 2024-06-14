import { Injectable } from '@nestjs/common';
import { CacheOptions } from './interfaces';
import { IntentConfig } from '../config/service';

@Injectable()
export class CacheMetadata {
  private static data: CacheOptions;

  constructor(config: IntentConfig) {
    CacheMetadata.data = config.get('cache');
  }

  static getData(): CacheOptions {
    return CacheMetadata.data;
  }
}
