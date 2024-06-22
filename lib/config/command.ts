import { Injectable } from "@nestjs/common";
import { Command, ConsoleIO } from "../console";
import { Obj } from "../utils";
import { Arr } from "../utils/array";
import { IntentConfig } from "./service";

@Injectable()
export class ViewConfigCommand {
  constructor(private config: IntentConfig) {}

  @Command("config:view {namespace}")
  async handle(_cli: ConsoleIO): Promise<void> {
    const namespace = _cli.argument<string>("namespace");
    const config = this.config.get(namespace);
    const printableConfig = Arr.toObj(Obj.entries(config), ["key", "value"]);
    _cli.table(["Key", "Value"], printableConfig);
  }
}
