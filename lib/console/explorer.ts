import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { ConsoleConstants } from './constants';
import { CommandMeta } from './metadata';
import { GenericFunction } from '../interfaces';
import { CommandMetaOptions } from './interfaces';

@Injectable()
export class ConsoleExplorer {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onModuleInit() {
    const wrappers = this.discovery.getProviders();
    wrappers.forEach((w) => {
      const { instance } = w;
      if (
        !instance ||
        typeof instance === 'string' ||
        !Object.getPrototypeOf(instance)
      ) {
        return;
      }

      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (key: string) => this.lookupConsoleCommands(instance, key),
      );
    });
  }

  lookupConsoleCommands(
    instance: Record<string, GenericFunction>,
    key: string,
  ) {
    const methodRef = instance[key];
    const hasCommandMeta = Reflect.hasMetadata(
      ConsoleConstants.commandName,
      instance,
      key,
    );
    const isClassConsoleCommand = Reflect.hasMetadata(
      ConsoleConstants.commandName,
      instance.constructor,
    );

    if (!hasCommandMeta && !isClassConsoleCommand) return;

    if (isClassConsoleCommand && key != 'handle') return;

    const command =
      Reflect.getMetadata(ConsoleConstants.commandName, instance, key) ||
      Reflect.getMetadata(ConsoleConstants.commandName, instance.constructor);

    const options: CommandMetaOptions =
      Reflect.getMetadata(ConsoleConstants.commandOptions, instance, key) ||
      Reflect.getMetadata(
        ConsoleConstants.commandOptions,
        instance.constructor,
      );

    CommandMeta.setCommand(command, options, methodRef.bind(instance));
  }
}
