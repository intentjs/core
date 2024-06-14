import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '../../console';
import { ObjectionService } from '../service';

@Injectable()
export class DatabaseUtilitiesCommand {
  constructor() {}

  @Command('db:column-info {tableName} {--connection==}')
  async listColumnInfo(_cli: ConsoleIO): Promise<void> {
    const conn =
      _cli.option<string>('connection') || ObjectionService.config.default;
    const knex = ObjectionService.connection(conn);
    const tableName = _cli.argument<string>('tableName');

    const columnInfo = await knex.table(tableName).columnInfo();

    const arr = [];
    for (const column in columnInfo) {
      arr.push({
        column,
        ...columnInfo[column],
      });
    }

    console.log(arr);
    _cli.table(['Column', ''], arr);
  }
}
