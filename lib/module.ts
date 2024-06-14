import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscoveryModule } from "@nestjs/core";
import { ConsoleExplorer, ListCommands } from "./console";
import { DbOperationsCommand } from "./database/commands/migrations";
import { ObjectionService } from "./database";
import { EventExplorer } from "./events";
import { StorageService } from "./storage/service";
import { CacheMetadata } from "./cache/metadata";
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

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [
    ConsoleExplorer,
    ListCommands,
    DbOperationsCommand,
    ObjectionService,
    EventExplorer,
    StorageService,
    CacheMetadata,
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
  ],
  exports: [IntentConfig],
})
export class IntentModule {}
