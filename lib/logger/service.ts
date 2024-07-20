import { Injectable } from '@nestjs/common';
import {
  Formats,
  FormatsMap,
  IntentLoggerOptions,
  LoggerConfig,
  Transports,
  TransportsMap,
  TransportOptions,
  defaultLoggerOptions,
} from './options';
import * as winston from 'winston';
import { IntentConfig } from '../config/service';
import { Num } from '../utils/number';
import { path } from 'app-root-path';
import { join } from 'path';

@Injectable()
export class LoggerService {
  private static config: IntentLoggerOptions;
  private static options: any = {};

  constructor(private readonly config: IntentConfig) {
    const options = this.config.get<IntentLoggerOptions>('logger');
    LoggerService.config = options;
    for (const conn in options.loggers) {
      LoggerService.options[conn] = LoggerService.createLogger(
        options.loggers[conn],
      );
    }
  }

  static getConnection(conn?: string): winston.Logger {
    conn = conn || LoggerService.config.default;
    return LoggerService.options[conn as string];
  }

  static createLogger(options: LoggerConfig) {
    options = { ...defaultLoggerOptions(), ...options };

    const transportsConfig = [];
    for (const transportOptions of options.transports) {
      let transport = transportOptions.transport;
      const formats = Num.isInteger(transportOptions.format)
        ? [transportOptions.format]
        : transportOptions.format;

      if (Num.isInteger(transport)) {
        transport = TransportsMap[transportOptions.transport as Transports];
      }

      transport = transport as winston.transport;
      const options = {
        format: this.buildFormatter(formats as Formats[]),
        filename: join(path, 'storage/logs', transportOptions.filename ?? ''),
      } as TransportOptions;

      transportsConfig.push(
        new TransportsMap[transportOptions.transport as Transports](options),
      );
    }

    options.transports = transportsConfig;
    return winston.createLogger({
      transports: transportsConfig,
      level: options.level,
    });
  }

  static logger(conn?: string): winston.Logger {
    return LoggerService.getConnection(conn);
  }

  private static buildFormatter(formats: Formats[]) {
    const formatters = [];
    for (const formatEnum of formats) {
      const formatter = FormatsMap[formatEnum as Formats] as any;
      formatters.push(formatter());
    }

    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      ...formatters,
    );
  }
}
