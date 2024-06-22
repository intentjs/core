import * as pc from "picocolors";
import { Str } from "./strings";

export class InternalLogger {
  static moduleName = "Intent";

  static error(cls: string, msg: string): void {
    const logLevel = this.danger("ERROR");
    const formattedCls = this.warn(this.formatClass(cls));
    msg = this.danger(msg);

    console.log(
      `${this.getPrintableTag("danger")}${Str.ws(
        5
      )}${logLevel} ${formattedCls} ${msg}`
    );
  }

  private static formatClass(msg: string): string {
    return `[${msg}]`;
  }

  private static danger(msg: string): string {
    return pc.isColorSupported ? pc.red(msg) : msg;
  }

  private static warn(msg: string): string {
    return pc.isColorSupported ? pc.yellow(msg) : msg;
  }

  static getPrintableTag(type?: string): string {
    const pid = process.pid;
    const statement = `[Intent] ${pid} - `;
    const colorFn = type === "danger" ? pc.red : pc.green;
    const module = pc.isColorSupported ? colorFn(statement) : statement;
    const timestamp = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    }).format(new Date());

    return `${module} ${timestamp}`;
  }
}
