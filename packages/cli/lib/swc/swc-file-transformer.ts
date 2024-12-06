import { dirname, join } from "path";
import { defaultSwcOptionsFactory } from "./default-options";
import { transformFile, transformFileSync } from "@swc/core";
import { mkdirSync, writeFileSync } from "fs-extra";
import chokidar from "chokidar";
import { fork } from "child_process";
import { ExtraOptions } from "../interfaces";
import { treeKillSync } from "../utils/tree-kill";
import { TsConfigLoader } from "../typescript/tsconfig-loader";
import { debounce } from "radash";
import { TypeCheckerHost } from "../type-checker/type-checker";
import ts from "typescript";
import { SWC_DEBUG_LOG_PREFIX } from "../utils/log-helpers";

export class SwcFileTransformer {
  tsConfigLoader = new TsConfigLoader();
  typeCheckerHost = new TypeCheckerHost();

  async run(
    tsConfigPath: string,
    options: ReturnType<typeof defaultSwcOptionsFactory>,
    extras: ExtraOptions,
    onSuccessHook?: () => void
  ): Promise<void> {
    if (extras.watch) {
      if (extras.typeCheck) {
        await this.runTypeCheck(extras);
      }

      await this.transformFiles(tsConfigPath, options, extras);

      const delayedOnChange = debounce({ delay: 150 }, () => {
        this.transformFiles(tsConfigPath, options, extras);
        onSuccessHook && onSuccessHook();
      });

      if (onSuccessHook) {
        const debouncedSuccess = debounce({ delay: 500 }, onSuccessHook);
        debouncedSuccess();
      }

      this.watchIncludedFiles(tsConfigPath, delayedOnChange);
    } else {
      if (extras.typeCheck) {
        await this.runTypeCheck(extras);
      }

      await this.transformFiles(tsConfigPath, options, extras);
    }
  }

  async runTypeCheck(extras: ExtraOptions): Promise<void> {
    const tsConfigPath = this.tsConfigLoader.loadPath();

    if (extras.watch) {
      const args = [tsConfigPath, JSON.stringify(extras)];
      const childProcess = fork(
        join(__dirname, "../type-checker/forked-type-checker.js"),
        args,
        { cwd: process.cwd(), stdio: "inherit" }
      );

      process.on(
        "exit",
        () => childProcess && treeKillSync(childProcess.pid as number)
      );
    } else {
      const cb = (resolve: Function) =>
        this.typeCheckerHost.runOnce(tsConfigPath, {
          watch: false,
          onTypeCheck: (program: ts.Program) => {
            resolve(true);
          },
        });
      return new Promise((resolve) => cb(resolve));
    }
  }

  async transformFiles(
    tsConfigPath: string,
    options: ReturnType<typeof defaultSwcOptionsFactory>,
    extras: ExtraOptions
  ) {
    const now = Date.now();
    const tsConfig = this.tsConfigLoader.load(tsConfigPath);
    const { include = [] } = tsConfig;
    const fileTransformationPromises = [];
    const isWindows = process.platform === "win32";

    for (const filePath of include) {
      const fileTransformerPromise = (resolve: Function) =>
        transformFile(filePath, { ...options, filename: filePath })
          .then(({ code, map }) => {
            const distFilePath = this.getDistPath(
              isWindows,
              filePath,
              tsConfig.compilerOptions.outDir,
              tsConfig.compilerOptions.baseUrl
            );

            const codeFilePath = join(
              process.cwd(),
              distFilePath.replace(/\.ts$/, ".js").replace(/\.tsx$/, ".js")
            );

            const osSpecificdistDirectory = dirname(
              isWindows ? this.convertToWindowsPath(codeFilePath) : codeFilePath
            );
            mkdirSync(osSpecificdistDirectory, { recursive: true });

            const osSpecificFilePath = isWindows
              ? this.convertToWindowsPath(codeFilePath)
              : codeFilePath;
            writeFileSync(osSpecificFilePath, code);

            if (options.sourceMaps) {
              const mapFilePath = distFilePath
                .replace(/\.ts$/, ".js.map")
                .replace(/\.tsx$/, ".js.map");
              const osSpecificMapFilePath = isWindows
                ? this.convertToWindowsPath(mapFilePath)
                : mapFilePath;
              writeFileSync(osSpecificMapFilePath, map as string);
            }
            resolve(1);
          })
          .catch((err) => console.error(err));

      fileTransformationPromises.push(new Promise(fileTransformerPromise));
    }

    await Promise.allSettled(fileTransformationPromises);

    console.log(
      SWC_DEBUG_LOG_PREFIX,
      `Successfully transpiled ${include.length} files in ${Date.now() - now}ms`
    );
  }

  getDistPath(
    isWindows: boolean,
    filePath: string,
    outDir: string,
    baseUrl: string
  ): string {
    return join(outDir, join(filePath).replace(join(baseUrl), ""))
      .replace(join(baseUrl), "")
      .replace(isWindows ? /^\\/ : /^\//, "");
  }

  writeToFile(resolve: Function) {}

  convertToWindowsPath(filePath: string): string {
    return filePath.replace(/\//g, "\\");
  }

  watchIncludedFiles(tsConfigPath: string, onChange: () => void) {
    const tsConfig = this.tsConfigLoader.load(tsConfigPath);
    const { includeDirs } = tsConfig;

    const watcher = chokidar.watch(
      [...includeDirs, "../../node_modules/@intentjs/**/*"].map((dir: string) =>
        join(dir, "**/*.ts")
      ),
      {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 50, pollInterval: 10 },
      }
    );

    watcher
      .on("add", () => onChange())
      .on("change", () => onChange())
      .on("error", () => onChange());
  }
}
