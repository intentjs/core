import { Model } from 'objection';
import { LoadRelOptions, LoadRelSchema } from './interfaces';
import { CustomQueryBuilder } from './queryBuilders/custom';
import { SoftDeleteQueryBuilder } from './queryBuilders/softDelete';

export class BaseModel extends Model {
  readonly id?: number | string;
  readonly deletedAt?: Date;

  /**
   * Specifies the connection to be used by the model.
   */
  static connection: string;

  /**
   * Specifies if the model supports soft delete feature.
   */
  static softDelete = false;

  QueryBuilderType!: CustomQueryBuilder<this> | SoftDeleteQueryBuilder<this>;

  static get QueryBuilder() {
    if (this.softDelete) return SoftDeleteQueryBuilder;

    return CustomQueryBuilder;
  }

  static useLimitInFirst = true;

  async $forceLoad(
    expression: LoadRelSchema,
    options?: LoadRelOptions,
  ): Promise<void> {
    await this.$fetchGraph(expression, {
      ...(options || {}),
      skipFetched: false,
    });
  }

  async $load(
    expression: LoadRelSchema,
    options?: LoadRelOptions,
  ): Promise<void> {
    await this.$fetchGraph(expression, {
      skipFetched: true,
      ...(options || {}),
    });

    return;
  }
}
