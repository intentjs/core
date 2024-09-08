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
import { LocalizationService } from './localization';
import { LoggerService } from './logger';
import { MailerService } from './mailer';
import { ServiceProvider } from './providers';
import { QueueService } from './queue';
import { QueueConsoleCommands } from './queue/console';
import { QueueMetadata } from './queue/metadata';
import { StorageService } from './storage/service';

export class IntentServiceProvider extends ServiceProvider {
  register() {
    this.import(
      DiscoveryModule,
      ConfigModule.forRoot({
        isGlobal: true,
        expandVariables: true,
        load: config,
      }),
    );
    this.provide(
      IntentExplorer,
      ListCommands,
      DbOperationsCommand,
      ObjectionService,
      StorageService,
      CacheService,
      QueueService,
      QueueConsoleCommands,
      QueueMetadata,
      CodegenCommand,
      CodegenService,
      ViewConfigCommand,
      IntentConfig,
      MailerService,
      LocalizationService,
      EventQueueWorker,
      LoggerService,
    );
  }

  /**
   * Add your application boot logic here.
   */
  boot() {}
}
