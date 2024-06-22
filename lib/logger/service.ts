import { Injectable } from "@nestjs/common";
import {
  Formats,
  FormatsMap,
  IntentLoggerOptions,
  LoggerConfig,
  Transports,
  TransportsMap,
  TransportOptions,
  defaultLoggerOptions,
} from "./options";
import * as winston from "winston";
import { IntentConfig } from "../config/service";
import { Num } from "../utils/number";

@Injectable()
export class LoggerService {
  private static config: IntentLoggerOptions;
  private static options: any = {};

  constructor(private readonly config: IntentConfig) {
    const options = config.get<IntentLoggerOptions>("logger");
    LoggerService.config = options;
    console.log("conifg options=============>", options);
    for (const conn in options.loggers) {
      LoggerService.options[conn] = LoggerService.createLogger(
        options.loggers[conn]
      );
    }
  }

  static getConnection(conn?: string): winston.Logger {
    conn = conn || LoggerService.config.default;
    return LoggerService.options[conn as string];
  }

  static createLogger(options: LoggerConfig) {
    options = {
      ...defaultLoggerOptions(),
      ...options,
    };
    const transportsConfig = [];
    for (const transportOptions of options.transports) {
      let transport = transportOptions.transport;
      let format = transportOptions.format;

      if (Num.isInteger(transportOptions.format)) {
        format = FormatsMap[transportOptions.format as Formats];
      }
      if (Num.isInteger(transport)) {
        transport = TransportsMap[transportOptions.transport as Transports];
      }
      format = format as (options?: any) => winston.Logform.Format;
      transport = transport as winston.transport;
      const options = {
        format: format(),
        filename: transportOptions.filename,
      } as TransportOptions;

      transportsConfig.push(
        new TransportsMap[transportOptions.transport as Transports](options)
      );
    }
    options.transports = transportsConfig;
    return winston.createLogger({
      transports: transportsConfig,
      level: options.level,
    } as any);
  }

  static logger(conn?: string): winston.Logger {
    return LoggerService.getConnection(conn);
  }
}
