export type LiteralString<T extends string> = string extends T ? never : T;

export type StaticObjOrFunc<T> = T | (() => T | Promise<T>);

export type Primitive = string | number | boolean | null | undefined;

// Recursive type to build dot notations
export type DotNotation<T, Prefix extends string = ''> = T extends Primitive
  ? string
  : T extends Array<infer U>
    ? DotNotation<U, `${Prefix}${Prefix extends '' ? '' : '.'}${number}`>
    : {
        [K in keyof T]: T[K] extends Primitive
          ? `${Prefix}${Prefix extends '' ? '' : '.'}${K & string}`
          : DotNotation<
              T[K],
              `${Prefix}${Prefix extends '' ? '' : '.'}${K & string}`
            >;
      }[keyof T];

export type GetNestedPropertyType<
  T,
  K extends string,
  F = any,
> = K extends keyof T
  ? T[K]
  : K extends `${infer P}.${infer R}`
    ? P extends keyof T
      ? GetNestedPropertyType<T[P], R, F>
      : F
    : F;
