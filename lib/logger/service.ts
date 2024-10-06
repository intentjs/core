import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import * as winston from 'winston';
import { ConfigService } from '../config/service';
import { Obj } from '../utils';
import { Num } from '../utils/number';
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

@Injectable()
export class LoggerService {
  private static config: IntentLoggerOptions;
  private static options: any = {};

  constructor(private readonly config: ConfigService) {
    const options = this.config.get('logger') as IntentLoggerOptions;
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

      if (
        LoggerService.config.disableConsole &&
        transport === Transports.Console
      ) {
        continue;
      }

      const formats = Num.isInteger(transportOptions.format)
        ? [transportOptions.format]
        : transportOptions.format;

      if (Num.isInteger(transport)) {
        transport = TransportsMap[transportOptions.transport as Transports];
      }

      transport = transport as winston.transport;
      const options = {
        ...Obj.except(transportOptions.options, ['format']),
        format: this.buildFormatter(
          formats as Formats[],
          transportOptions.labels,
        ),
      } as TransportOptions;

      if (transportOptions.transport === Transports.File) {
        options['filename'] = join(
          path,
          'storage/logs',
          transportOptions.options?.['filename'],
        );
      }

      transportsConfig.push(
        new TransportsMap[transportOptions.transport as Transports](
          options as any,
        ),
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

  private static buildFormatter(
    formats: Formats[],
    labels?: Record<string, any>,
  ) {
    const formatters = [];
    for (const formatEnum of formats) {
      const formatter = FormatsMap[formatEnum as Formats] as any;
      formatters.push(formatter());
    }
    labels && formatters.push(winston.format.label(labels));

    return winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      ...formatters,
    );
  }
}
