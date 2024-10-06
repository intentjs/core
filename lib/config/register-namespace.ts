import { LiteralString } from '../type-helpers';
import {
  RegisterNamespaceOptions,
  RegisterNamespaceReturnType,
} from './options';

export const registerNamespace = <N extends string, T>(
  namespace: LiteralString<N>,
  factory: () => T | Promise<T>,
  options?: RegisterNamespaceOptions,
): RegisterNamespaceReturnType<LiteralString<N>, T> => {
  return {
    _: {
      namespace,
      options: {
        dynamic: options?.dynamic ?? false,
        encrypt: options?.encrypt ?? false,
      },
      factory,
    },
    $inferConfig: {} as T,
  };
};
