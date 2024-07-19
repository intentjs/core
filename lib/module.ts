import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscoveryModule } from "@nestjs/core";
import { ConsoleExplorer, ListCommands } from "./console";
import { DbOperationsCommand } from "./database/commands/migrations";
import { ObjectionService } from "./database";
import { EventExplorer } from "./events";
import { StorageService } from "./storage/service";
import { CacheService } from "./cache";
import { QueueService } from "./queue";
import { QueueConsoleCommands } from "./queue/console";
import { QueueExplorer } from "./queue/explorer";
import { CodegenCommand } from "./codegen/command";
import { CodegenService } from "./codegen/service";
import { ViewConfigCommand } from "./config/command";
import { IntentConfig } from "./config/service";
import { ExistsConstraint } from "./validator/decorators/exists";
import { IsUniqueConstraint } from "./validator/decorators/isUnique";
import { LoggerService } from "./logger/service";
import { GenericFunction } from "./interfaces";
import { EventQueueWorker } from "./events/jobListener";
import { MailerService } from "./mailer";

const providers = [
  ConsoleExplorer,
  ListCommands,
  DbOperationsCommand,
  ObjectionService,
  EventExplorer,
  StorageService,
  CacheService,
  QueueService,
  QueueConsoleCommands,
  QueueExplorer,
  CodegenCommand,
  CodegenService,
  ViewConfigCommand,
  IntentConfig,
  ExistsConstraint,
  IsUniqueConstraint,
  LoggerService,
  EventQueueWorker,
  MailerService,
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
