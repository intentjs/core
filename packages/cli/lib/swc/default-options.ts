import { Options } from "@swc/core";
import { ConfigurationInterface } from "../configuration/interface";
import { ExtraOptions } from "../interfaces";

export const defaultSwcOptionsFactory = (
  tsOptions: Record<string, any>,
  configuration: ConfigurationInterface,
  extras: ExtraOptions
): Options => {
  return {
    sourceMaps:
      tsOptions?.compilerOptions?.sourceMap ||
      (tsOptions?.inlineSourceMap && "inline"),
    module: {
      type: "commonjs",
    },
    exclude: ["node_modules", "dist"],
    jsc: {
      target: "es2021",
      parser: {
        syntax: "typescript",
        tsx: true,
        decorators: true,
        dynamicImport: true,
      },
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true,
        useDefineForClassFields: false,
      },
      keepClassNames: true,
      baseUrl: tsOptions?.compilerOptions?.baseUrl,
      paths: tsOptions?.compilerOptions?.paths,
    },
    minify: false,
    swcrc: true,
  };
};

/**
 * Converts Windows specific file paths to posix
 * @param windowsPath
 */
function convertPath(windowsPath: string) {
  return windowsPath
    .replace(/^\\\\\?\\/, "")
    .replace(/\\/g, "/")
    .replace(/\/\/+/g, "/");
}
