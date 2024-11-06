import ts from "typescript";
import { join } from "path";
import { existsSync } from "fs";
import { spawn } from "child_process";
import killProcess from "tree-kill";
import { ConfigurationLoader } from "../lib/configuration/configuration-loader";
import { ConfigurationInterface } from "../lib/configuration/interface";
import { ExtraOptions } from "../lib/interfaces";
import { defaultSwcOptionsFactory } from "../lib/swc/default-options";
import { SwcFileTransformer } from "../lib/swc/swc-file-transformer";
import { TsConfigLoader } from "../lib/typescript/tsconfig-loader";
import { isTruthy } from "../lib/utils/helpers";
import { treeKillSync } from "../lib/utils/tree-kill";

export class StartServerCommand {
  protected readonly configurationLoader = new ConfigurationLoader();
  protected readonly tsConfigLoader = new TsConfigLoader();
  protected readonly swcFileTransformer = new SwcFileTransformer();

  async handle(options: Record<string, any>): Promise<void> {
    const {
      watch = false,
      debug = false,
      disableTypeCheck,
      config,
      tsconfig: tsConfigPath,
      port,
    } = options;

    const intentConfigFilePath = this.configurationLoader.loadPath(config);
    const intentFileConfig =
      this.configurationLoader.load(intentConfigFilePath);

    const tsConfig = this.tsConfigLoader.load(tsConfigPath);

    const extraOptions: ExtraOptions = {
      watch,
      typeCheck: !isTruthy(disableTypeCheck),
      debug,
      port,
    };

    const swcOptions = defaultSwcOptionsFactory(
      tsConfig,
      intentFileConfig,
      extraOptions
    );

    const onSuccessHook = this.createOnSuccessHook(
      intentFileConfig,
      tsConfig.compilerOptions,
      extraOptions
    );

    await this.swcFileTransformer.run(
      tsConfigPath,
      swcOptions,
      extraOptions,
      onSuccessHook
    );
  }

  private createOnSuccessHook(
    intentConfiguration: ConfigurationInterface,
    tsOptions: ts.CompilerOptions,
    extraOptions: ExtraOptions
  ) {
    let childProcessRef: any;
    process.on("exit", () => {
      childProcessRef && treeKillSync(childProcessRef.pid);
    });

    return () => {
      if (childProcessRef) {
        childProcessRef.removeAllListeners("exit");
        childProcessRef.on("exit", () => {
          childProcessRef = this.spawnChildProcess(
            intentConfiguration.serverFile,
            intentConfiguration.sourceRoot,
            extraOptions.debug,
            tsOptions.outDir as string,
            "node",
            extraOptions
          );
          childProcessRef.on("exit", () => (childProcessRef = undefined));
        });
        childProcessRef.stdin && childProcessRef.stdin.pause();
        killProcess(childProcessRef.pid);
      } else {
        childProcessRef = this.spawnChildProcess(
          intentConfiguration.serverFile,
          intentConfiguration.sourceRoot,
          extraOptions.debug,
          tsOptions.outDir as string,
          "node",
          extraOptions
        );
        childProcessRef.on("exit", (code: number) => {
          process.exitCode = code;
          childProcessRef = undefined;
        });
      }
    };
  }

  private spawnChildProcess(
    serverFile: string,
    sourceRoot: string,
    debug: boolean | string | undefined,
    outDirName: string,
    binaryToRun: string,
    extraOptions: ExtraOptions
  ) {
    let outputFilePath = join(outDirName, sourceRoot, serverFile);
    if (!existsSync(outputFilePath + ".js")) {
      outputFilePath = join(outDirName, serverFile);
    }

    let childProcessArgs: string[] = [];
    const argsStartIndex = process.argv.indexOf("--");
    if (argsStartIndex >= 0) {
      childProcessArgs = process.argv
        .slice(argsStartIndex + 1)
        .map((arg) => JSON.stringify(arg));
    }

    extraOptions.debug &&
      childProcessArgs.push(`--debug=${extraOptions.debug}`);

    extraOptions.port && childProcessArgs.push(`--port=${extraOptions.port}`);

    outputFilePath =
      outputFilePath.indexOf(" ") >= 0 ? `"${outputFilePath}"` : outputFilePath;

    const processArgs = [outputFilePath, ...childProcessArgs];
    if (debug) {
      const inspectFlag =
        typeof debug === "string" ? `--inspect=${debug}` : "--inspect";
      processArgs.unshift(inspectFlag);
    }
    processArgs.unshift("--enable-source-maps");
    return spawn(binaryToRun, processArgs, {
      stdio: "inherit",
      shell: true,
    });
  }
}
