import { Injectable, OnModuleInit } from '@nestjs/common';
import Knex, { Knex as KnexType } from 'knex';
import { logTime } from '../utils/helpers';
import { InternalLogger } from '../utils/logger';
import { BaseModel } from './baseModel';
import { ConnectionNotFound } from './exceptions';
import { DatabaseOptions, DbConnectionOptions } from './options';
import { ConfigService } from '../config';

@Injectable()
export class ObjectionService implements OnModuleInit {
  static config: DatabaseOptions;
  static dbConnections: Record<string, KnexType>;

  constructor(config: ConfigService) {
    const dbConfig = config.get('db') as DatabaseOptions;
    if (!dbConfig) return;
    const defaultConnection = dbConfig.connections[dbConfig.default];
    ObjectionService.config = dbConfig;
    ObjectionService.dbConnections = {};
    BaseModel.knex(Knex(defaultConnection));
    for (const conName in dbConfig.connections) {
      const knexConfig = { ...dbConfig.connections[conName] };
      ObjectionService.dbConnections[conName] = Knex(knexConfig);
    }
  }

  async onModuleInit() {
    for (const connName in ObjectionService.dbConnections) {
      const time = Date.now();
      const connection = ObjectionService.dbConnections[connName];
      const dbOptions = ObjectionService.getOptions(connName);

      try {
        await connection.raw(dbOptions.validateQuery || 'select 1+1 as result');
        InternalLogger.success(
          'DatabaseService',
          `Was able to successfully validate [${connName}] connection ${logTime(
            Date.now() - time,
          )}`,
        );
      } catch (_e) {
        const e = _e as Error;
        InternalLogger.error(
          'DatabaseService',
          `Validation for connection [${connName}] failed with reason ${
            e.message
          } ${logTime(Date.now() - time)}`,
        );
      }
    }
  }

  static getOptions(conName?: string): DbConnectionOptions {
    // check if conName is a valid connection name
    conName = conName || ObjectionService.config.default;

    const isConNameValid = Object.keys(
      ObjectionService.config.connections,
    ).includes(conName);

    if (conName && !isConNameValid) {
      throw new ConnectionNotFound(conName);
    }

    return ObjectionService.config.connections[conName];
  }

  static connection(conName?: string): KnexType {
    // check if conName is a valid connection name
    conName = conName || ObjectionService.config.default;

    const isConNameValid = Object.keys(
      ObjectionService.config.connections,
    ).includes(conName);

    if (conName && !isConNameValid) {
      throw new ConnectionNotFound(conName);
    }

    return ObjectionService.dbConnections[conName];
  }
}
