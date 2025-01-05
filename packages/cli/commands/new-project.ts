import { join } from "path";
import { INTENT_LOG_PREFIX } from "../lib/utils/log-helpers";
import pc from "picocolors";
import {
  emptyDir,
  emptyDirSync,
  existsSync,
  remove,
  removeSync,
} from "fs-extra";
import * as p from "@clack/prompts";
import { NEW_PROJECT_OPTIONS } from "../lib/configuration/new-project-config";
import { downloadRepository } from "../lib/new-project/download-helper";
import {
  NEW_PROJECT_CONFIG,
  SAFE_DELETE_FILES,
} from "../lib/new-project/config";
import { downloadDependenciesUsingNpm } from "../lib/new-project/actions/download-depedencies";
import { runCommandInsideProject } from "../lib/new-project/actions/run-command";
import { execSync } from "child_process";
import { checkIfGitIsInstalled } from "../lib/new-project/actions/download-helper";
import { DownloadFromRegistry } from "../lib/new-project/actions/download-from-registry";
import { injectKeyValue } from "../lib/codegen/inject-config";

export class NewProjectCommand {
  constructor() {}

  async handle(name: string, options: Record<string, any>) {
    console.log(name, options);
    /**
     * Check if provided name is available for creating a directory
     */
    this.checkIfDirNameIsValidAndAvailable(name);

    /**
     * Build Prompt Options
     */
    const promptOptions = this.buildPromptOptions(options);
    const missingOptions = await p.group(
      { ...promptOptions },
      {
        onCancel: ({ results }) => {
          p.log.error("User cancelled prompt! Exiting now...");
          process.exit(0);
        },
      }
    );

    const config = NEW_PROJECT_CONFIG;
    const starterTemplateName = `${config.gitOrg}/${config.repoName}`;

    // await p.tasks([
    //   {
    //     title: "Downloading the starter template",
    //     task: async (message) => {
    //       const success = await downloadRepository(starterTemplateName, name);
    //       !success && process.exit(0);
    //       return "Starter template cloned! 🎉";
    //     },
    //   },
    //   {
    //     title: "Cleaning up files",
    //     task: async (message) => {
    //       const deleteFilesPromise = [];
    //       for (const dirOrFileName of SAFE_DELETE_FILES) {
    //         deleteFilesPromise.push(remove(join(name, dirOrFileName)));
    //       }

    //       await Promise.allSettled(deleteFilesPromise);
    //       return "Files cleaned up 🗑️";
    //     },
    //   },
    //   {
    //     title: "Installing via npm",
    //     task: async (message) => {
    //       downloadDependenciesUsingNpm(name);
    //       return "Installed dependencies using npm";
    //     },
    //   },
    //   {
    //     title: "Setting up the selected configuration",
    //     task: (message) => {},
    //   },
    // ]);

    const finalOptions = { ...options, ...missingOptions };

    console.log(finalOptions);

    const { queue } = finalOptions;

    if (queue) {
      const downloadFromRegistry = new DownloadFromRegistry();
      const configToApply = await downloadFromRegistry.handle("");
      console.log("config to apply  ===> ", configToApply);
      const filePath = join("config", "queue.ts");
      injectKeyValue(filePath, configToApply);
    }
    console.log({ ...options, ...missingOptions });
  }

  buildPromptOptions(options: Record<string, any>) {
    console.log(options);
    const missingPromptOptions = [] as Record<string, any>;
    if (!("database" in options)) {
      const promptConfig = NEW_PROJECT_OPTIONS["database"];
      missingPromptOptions["database"] = () =>
        p.select({
          message: promptConfig.question,
          options: promptConfig.selectOptions,
        });
    }

    if (!("cache" in options)) {
      const promptConfig = NEW_PROJECT_OPTIONS["cache"];
      missingPromptOptions["cache"] = () =>
        p.select({
          message: promptConfig.question,
          options: promptConfig.selectOptions,
        });
    }

    if (!("storage" in options)) {
      const promptConfig = NEW_PROJECT_OPTIONS["storage"];
      missingPromptOptions["storage"] = () =>
        p.select({
          message: promptConfig.question,
          options: promptConfig.selectOptions,
        });
    }

    if (!("mailer" in options)) {
      const promptConfig = NEW_PROJECT_OPTIONS["mailer"];
      missingPromptOptions["mailer"] = () =>
        p.select({
          message: promptConfig.question,
          options: promptConfig.selectOptions,
        });
    }

    if (!("queue" in options)) {
      const promptConfig = NEW_PROJECT_OPTIONS["queue"];
      missingPromptOptions["queue"] = () =>
        p.select({
          message: promptConfig.question,
          options: promptConfig.selectOptions,
        });
    }

    return missingPromptOptions;
  }

  checkIfDirNameIsValidAndAvailable(name: string) {
    // Check if directory name is valid
    const isWindows = process.platform === "win32";
    const invalidCharsRegex = isWindows
      ? /[<>:"/\\|?*\x00-\x1F]/g // Windows invalid chars
      : /[/\x00]/g; // Unix/Linux invalid chars

    if (!name || name.trim().length === 0) {
      console.log(INTENT_LOG_PREFIX, pc.red("Directory name cannot be empty"));
      process.exit(1);
    }

    if (name === "." || name === "..") {
      console.log(INTENT_LOG_PREFIX, pc.red("Invalid directory name"));
      process.exit(1);
    }

    if (invalidCharsRegex.test(name)) {
      console.log(
        INTENT_LOG_PREFIX,
        pc.red(
          `Directory name contains invalid characters${
            isWindows ? ' (< > : " \\ / | ? * are not allowed)' : ""
          }`
        )
      );
      process.exit(1);
    }

    // Check if name is available
    const dirPath = join(process.cwd(), name);
    console.log(dirPath);
    if (existsSync(dirPath)) {
      console.log(
        INTENT_LOG_PREFIX,
        pc.red(`Directory "${name}" already exists`)
      );
      process.exit(1);
    }
  }
}
