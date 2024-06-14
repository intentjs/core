import { ExpParser } from '../utils/expParser';
import { TransformerContext } from './interfaces';

export abstract class Transformer {
  public availableIncludes = [];
  public defaultIncludes = [];
  protected includes = {};
  public ctx: TransformerContext;

  abstract transform(object: any): Promise<Record<string, any> | null>;

  setContext(ctx: TransformerContext): Transformer {
    this.ctx = ctx;
    return this;
  }

  /**
   * Use this when you want to include single object,
   * which is transformed by some other transformer.
   *
   * @param obj
   * @param transformer
   * @param options
   */
  async item(
    obj: Record<string, any>,
    transformer: Transformer,
    ctx?: TransformerContext,
  ): Promise<Record<string, any> | null> {
    if (!obj) return null;
    transformer = this.applyOptions(transformer, ctx);
    return transformer.work(obj);
  }

  /**
   * Use this when you want to include multiple objects,
   * which is transformed by some other transformer.
   *
   * @param arr
   * @param transformer
   * @param options
   */
  async collection(
    arr: Array<Record<string, any> | string>,
    transformer: Transformer,
    options?: TransformerContext,
  ): Promise<Array<any>> {
    if (!arr || arr.length === 0) return [];
    transformer = this.applyOptions(transformer, options);
    const result = [];
    for (let data of arr) {
      data = await transformer.work(data);
      result.push(data);
    }
    return result;
  }

  applyOptions(
    transformer: Transformer,
    ctx?: TransformerContext,
  ): Transformer {
    transformer.setContext(ctx);
    return transformer;
  }

  parseIncludes(): this {
    this.includes = ExpParser.from(this.ctx?.getIncludes() || '').toObj();
    for (const include of this.defaultIncludes) {
      if (!(include in this.includes)) {
        this.includes[include] = undefined;
      }
    }

    return this;
  }

  async work(
    data: any,
  ): Promise<Record<string, any> | Array<Record<string, any>>> {
    if (!data) return null;
    this.parseIncludes();
    let result = {};
    if (data instanceof Object) {
      result = await this.transform(data);
    }

    const handlerName = (name: string) =>
      'include' + name.charAt(0).toUpperCase() + name.slice(1);

    console.log(this.includes);
    for (const include in this.includes) {
      const handler = handlerName(include);
      const nestedIncludes = this.includes[include];

      console.log('nested includes ===> ', nestedIncludes);
      if (this[handler]) {
        result[include] = await this[handler](
          data,
          new TransformerContext({
            ...this.ctx.options,
            include: nestedIncludes?.join(','),
          }),
        );
      }
    }

    return result;
  }
}
