import { ModuleMetadata, Type } from '@nestjs/common';
import { Logform, transports, format, transport } from 'winston';
import { Str } from '../utils/strings';

export enum Transports {
  Default,
  Console,
  File,
  Http,
  Stream,
}

export type TransportOptions = transports.ConsoleTransportOptions &
  transports.HttpTransportOptions &
  transports.FileTransportOptions &
  transports.StreamTransportOptions;

export enum Formats {
  Default,
  Simple,
  Align,
  Cli,
  Colorize,
  Combine,
  Errors,
  Json,
  Label,
  Logstash,
  Metadata,
  Ms,
  PadLevels,
  PrettyPrint,
  Printf,
  Splat,
  Timestamp,
  Uncolorize,
}

export interface LoggerConfig {
  level?: string;
  transports?: {
    format?: Formats | ((options?: any) => Logform.Format);
    transport?: Transports | transport;
    filename?: string;
    options?: {
      level?: string;
      silent?: boolean;
      handleExceptions?: boolean;
      handleRejections?: boolean;
      log?(info: any, next: () => void): any;
      logv?(info: any, next: () => void): any;
      close?(): void;
    };
  }[];
}
export const defaultLoggerOptions = () => ({
  level: 'debug',
  transports: [
    {
      transport: Transports.Default,
      format: Formats.Default,
    },
  ],
});

export interface IntentLoggerOptions {
  isGlobal: boolean;
  default: string;
  disableConsole: boolean;
  loggers: {
    [key: string]: LoggerConfig;
  };
}

export interface LoggerAsyncOptionsFactory {
  createLoggerOptions(): Promise<IntentLoggerOptions> | IntentLoggerOptions;
}

export interface IntentLoggerAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  isGlobal: boolean;
  useExisting?: Type<IntentLoggerOptions>;
  useClass?: Type<LoggerAsyncOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<IntentLoggerOptions> | IntentLoggerOptions;
  inject?: any[];
}

export const TransportsMap = {
  [Transports.Default]: transports.Console,
  [Transports.Console]: transports.Console,
  [Transports.File]: transports.File,
  [Transports.Http]: transports.Http,
  [Transports.Stream]: transports.Stream,
};
const defaultFormat = () => {
  const date = new Date().toISOString();
  const logFormat = format.printf((info) => {
    return `${date} - ${info.level}: ${Str.isString(info.message) ? info.message : JSON.stringify(info.message, null, 4)}`;
  });
  return format.combine(format.colorize(), logFormat);
};

export const FormatsMap = {
  [Formats.Default]: defaultFormat,
  [Formats.Simple]: format.simple,
  [Formats.Align]: format.align,
  [Formats.Cli]: format.cli,
  [Formats.Colorize]: format.colorize,
  [Formats.Combine]: format.combine,
  [Formats.Errors]: format.errors,
  [Formats.Json]: format.json,
  [Formats.Label]: format.label,
  [Formats.Logstash]: format.logstash,
  [Formats.Metadata]: format.metadata,
  [Formats.Ms]: format.ms,
  [Formats.PadLevels]: format.padLevels,
  [Formats.PrettyPrint]: format.prettyPrint,
  [Formats.Printf]: format.printf,
  [Formats.Splat]: format.splat,
  [Formats.Timestamp]: format.timestamp,
  [Formats.Uncolorize]: format.uncolorize,
};
