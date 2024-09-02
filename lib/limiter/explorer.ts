import { Injectable } from "@nestjs/common";
import { DiscoveryService, MetadataScanner } from "@nestjs/core";
import { ulid } from "ulid";
import { Limiter } from "./rateLimiter";
import { GenericFunction } from "../interfaces";
import { REFILL_INTERVAL, TOKEN_COUNT } from "./constants";

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
    const hasCommandMeta = Reflect.hasMetadata(TOKEN_COUNT, instance, key);

    if (!hasCommandMeta) return;

    const tokensCount = Reflect.getMetadata(TOKEN_COUNT, instance, key);
    const frequency = Reflect.getMetadata(REFILL_INTERVAL, instance, key);
    const funcKey = ulid();
    Limiter.initializeToken(key + funcKey, tokensCount, frequency);
    instance[key] = function (...args) {
      Limiter.useToken(key + funcKey);
      return methodRef.apply(instance, args);
    };
  }
}
