import { LiteralString } from '../type-helpers';
import {
  RegisterNamespaceOptions,
  RegisterNamespaceReturnType,
} from './options';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const registerNamespace = <N extends string, T>(
  namespace: LiteralString<N>,
  factory: () => T | Promise<T>,
  options?: RegisterNamespaceOptions,
): RegisterNamespaceReturnType<LiteralString<N>, T> => {
  return {
    _: {
      namespace,
      options: {
        encrypt: options?.encrypt ?? false,
      },
      factory,
    },
    $inferConfig: {} as T,
  };
};
