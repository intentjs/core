export type LiteralString<T extends string> = string extends T ? never : T;

export type StaticObjOrFunc<T> = T | (() => T | Promise<T>);

export type Primitive = string | number | boolean | null | undefined;

type Depth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type DotNotation<
  T,
  D extends number = 5,
  Prefix extends string = '',
> = D extends 0
  ? never
  : T extends Primitive
    ? Prefix
    : T extends Array<infer U>
      ? DotNotation<
          U,
          Depth[D],
          `${Prefix}${Prefix extends '' ? '' : '.'}${number}`
        >
      : {
          [K in keyof T]: T[K] extends Primitive
            ? `${Prefix}${Prefix extends '' ? '' : '.'}${K & string}`
            : DotNotation<
                T[K],
                Depth[D],
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
