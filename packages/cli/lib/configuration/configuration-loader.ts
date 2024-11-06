import { readFileSync } from "fs";
import { ConfigurationInterface } from "./interface";
import { join } from "path";
import { defaultIntentConfiguration } from "./default-configuration";
import { assign } from "radash";
import { INTENT_LOG_PREFIX } from "../utils/log-helpers";
import pc from "picocolors";

export class ConfigurationLoader {
  load(filePath: string): ConfigurationInterface {
    try {
      const buffer = readFileSync(filePath).toString();
      const configFromFile = JSON.parse(buffer);
      const defaultConfiguration = defaultIntentConfiguration();
      return assign(defaultConfiguration, configFromFile);
    } catch (e) {
      console.log(INTENT_LOG_PREFIX, pc.red(e.message));
      process.exit();
    }
  }

  loadPath(path?: string) {
    return join(process.cwd(), path || ".intentrc");
  }
}
