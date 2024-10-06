import { Injectable } from '@nestjs/common';
import {
  NamespacedConfigMapKeys,
  NamespacedConfigMapValues,
  RegisterNamespaceReturnType,
} from './options';

@Injectable()
export class ConfigBuilder {
  constructor() {}

  static async build(
    namespaceObjects: RegisterNamespaceReturnType<string, any>[],
  ): Promise<Map<string, any>> {
    const configMap = new Map();

    for (const namespacedConfig of namespaceObjects) {
      const namespacedMap = new Map<
        NamespacedConfigMapKeys,
        NamespacedConfigMapValues
      >();
      namespacedMap.set('factory', namespacedConfig._.factory);
      if (!namespacedConfig._.options.dynamic) {
        namespacedMap.set('static', namespacedConfig._.factory());
      }

      /**
       * Set options
       */
      namespacedMap.set('dynamic', namespacedConfig._.options.dynamic);
      namespacedMap.set('encrypt', namespacedConfig._.options.encrypt);

      configMap.set(namespacedConfig._.namespace, namespacedMap);
    }

    return configMap;
  }
}
