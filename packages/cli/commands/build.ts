import { ConfigurationLoader } from "../lib/configuration/configuration-loader";
import { defaultSwcOptionsFactory } from "../lib/swc/default-options";
import { SwcFileTransformer } from "../lib/swc/swc-file-transformer";
import { TsConfigLoader } from "../lib/typescript/tsconfig-loader";
import { isTruthy } from "../lib/utils/helpers";

export class BuildCommand {
  protected readonly configurationLoader = new ConfigurationLoader();
  protected readonly tsConfigLoader = new TsConfigLoader();
  protected readonly swcFileTransformer = new SwcFileTransformer();

  async handle(options: Record<string, any>): Promise<void> {
    const {
      watch = false,
      debug = false,
      disableTypeCheck,
      path,
      tsconfig: tsConfigPath,
    } = options;

    const intentConfigFilePath = this.configurationLoader.loadPath(path);
    const intentFileConfig =
      this.configurationLoader.load(intentConfigFilePath);

    const tsConfig = this.tsConfigLoader.load(tsConfigPath);

    const extraOptions = {
      watch,
      typeCheck: !isTruthy(disableTypeCheck),
      debug,
    };

    const swcOptions = defaultSwcOptionsFactory(
      tsConfig,
      intentFileConfig,
      extraOptions
    );

    await this.swcFileTransformer.run(tsConfigPath, swcOptions, extraOptions);
  }
}
