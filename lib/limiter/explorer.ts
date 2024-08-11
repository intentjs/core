import { Injectable } from "@nestjs/common";
import { DiscoveryService, MetadataScanner } from "@nestjs/core";
import { ulid } from "ulid";
import { Limiter } from "./rateLimiter";
import { GenericFunction } from "../interfaces";

@Injectable()
export class LimiterExplorer {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner
  ) {}

  onModuleInit() {
    const wrappers = this.discovery.getProviders();
    wrappers.forEach((w) => {
      const { instance } = w;
      if (
        !instance ||
        typeof instance === "string" ||
        !Object.getPrototypeOf(instance)
      ) {
        return;
      }

      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (key: string) => this.lookupConsoleCommands(instance, key)
      );
    });
  }

  lookupConsoleCommands(
    instance: Record<string, GenericFunction>,
    key: string
  ) {
    let methodRef = instance[key];
    const hasCommandMeta = Reflect.hasMetadata(
      "rate-limiter-tokens",
      instance,
      key
    );

    if (!hasCommandMeta) return;

    const tokensCount = Reflect.getMetadata(
      "rate-limiter-tokens",
      instance,
      key
    );
    const frequency = Reflect.getMetadata(
      "rate-limiter-interval",
      instance,
      key
    );
    console.log("limiter found", methodRef, key, tokensCount, frequency);
    const funcKey = ulid();
    Limiter.initializeToken(key + funcKey, tokensCount, frequency);
    instance[key] = function (...args) {
      Limiter.useToken(key + funcKey);
      console.log("Rate Limited");
      return methodRef.apply(instance, args);
    };

    // const options: CommandMetaOptions =
    //   Reflect.getMetadata(ConsoleConstants.commandOptions, instance, key) ||
    //   Reflect.getMetadata(
    //     ConsoleConstants.commandOptions,
    //     instance.constructor,
    //   );

    // CommandMeta.setCommand(command, options, methodRef.bind(instance));
  }
}
