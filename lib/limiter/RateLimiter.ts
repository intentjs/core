import { LimiterDriver } from "./interfaces/LimiterDriver";
import { BaseStrategy } from "./strategies/BaseStrategy";
import { Injectable } from "@nestjs/common";
import { RedisDriver } from "./drivers/redis";

@Injectable()
export class Limiter {
  private static driver: LimiterDriver;
  private static strategy: BaseStrategy;
  constructor() {
    Limiter.driver = new RedisDriver({
      driver: "redis",
      host: "localhost",
      port: 6379,
      database: 0,
    });
    Limiter.strategy = new BaseStrategy(Limiter.driver);
  }

  static initializeToken = (
    key: string,
    tokensCount: number,
    intervalInSeconds: number
  ) => {
    Limiter.strategy.initializeToken(key, tokensCount, intervalInSeconds);
  };

  static useToken = (key: string) => {
    Limiter.strategy.useToken(key);
  };
}
