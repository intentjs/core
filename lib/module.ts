import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import { CacheService } from './cache';
import { CodegenCommand } from './codegen/command';
import { CodegenService } from './codegen/service';
import { ViewConfigCommand } from './config/command';
import { IntentConfig } from './config/service';
import { ListCommands } from './console';
import { ObjectionService } from './database';
import { DbOperationsCommand } from './database/commands/migrations';
import { EventQueueWorker } from './events/jobListener';
import { IntentExplorer } from './explorer';
import { GenericFunction } from './interfaces';
import { LocalizationService } from './localization';
import { LoggerService } from './logger/service';
import { MailerService } from './mailer';
import { QueueService } from './queue';
import { QueueConsoleCommands } from './queue/console';
import { QueueMetadata } from './queue/metadata';
import { StorageService } from './storage/service';
import { ExistsConstraint } from './validator/decorators/exists';
import { IsUniqueConstraint } from './validator/decorators/isUnique';

const providers = [
  IntentExplorer,
  ListCommands,
  DbOperationsCommand,
  ObjectionService,
  StorageService,
  CacheService,
  QueueService,
  QueueConsoleCommands,
  CodegenCommand,
  CodegenService,
  ViewConfigCommand,
  IntentConfig,
  ExistsConstraint,
  IsUniqueConstraint,
  LoggerService,
  EventQueueWorker,
  MailerService,
  LocalizationService,
  QueueMetadata,
];
const imports = [DiscoveryModule];
const exportsArr = [IntentConfig];

@Global()
@Module({})
export class IntentModule {
  static register(config: GenericFunction[]): DynamicModule {
    return {
      global: true,
      module: IntentModule,
      imports: [
        ...imports,
        ConfigModule.forRoot({
          isGlobal: true,
          expandVariables: true,
          load: config,
        }),
      ],
      providers: providers,
      exports: exportsArr,
    };
  }
}
