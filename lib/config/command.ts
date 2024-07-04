import { Injectable } from "@nestjs/common";
import { Command, ConsoleIO } from "../console";
import { Obj } from "../utils";
import { Arr } from "../utils/array";
import { IntentConfig } from "./service";
import { columnify } from "../utils/columnify";
import * as pc from "picocolors";

@Injectable()
export class ViewConfigCommand {
  constructor(private config: IntentConfig) {}

  @Command("config:view {namespace}", {
    desc: "Command to view config for a given namespace",
  })
  async handle(_cli: ConsoleIO): Promise<void> {
    const namespace = _cli.argument<string>("namespace");
    const config = this.config.get(namespace);
    const columnifiedConfig = columnify(
      Arr.toObj(Obj.entries(config), ["key", "value"])
    );
    const printRows = [];
    for (const row of columnifiedConfig) {
      printRows.push([pc.green(row[0]), pc.yellow(row[1])].join(" "));
    }

    console.log(printRows.join("\n"));
  }
}
