import { ModuleMetadata, Type } from '@nestjs/common';

export interface LocalizationOptions {
  path: string;
  fallbackLang: string;
}

export interface LocalizationAsyncOptionsFactory {
  createLocalizationOptions():
    | Promise<LocalizationOptions>
    | LocalizationOptions;
}

export interface LocalizationAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<LocalizationOptions>;
  useClass?: Type<LocalizationAsyncOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<LocalizationOptions> | LocalizationOptions;
  inject?: any[];
}
