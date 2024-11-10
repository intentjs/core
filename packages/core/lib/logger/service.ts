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
  private static store = new Map<string, winston.Logger>();
  private static config: IntentLoggerOptions;

  /**
   * Method to make a new logger with the given config.
   * @param options
   * @returns
   */
  static makeLogger(options: LoggerConfig) {
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

  static logger(name?: string): winston.Logger {
    const options = ConfigService.get('logger') as IntentLoggerOptions;
    name = name ?? options.default;
    if (this.store.has(name)) return this.store.get(name);
    const config = options.loggers[name];
    const logger = LoggerService.makeLogger(config);
    this.store.set(name, logger);
    return logger;
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
