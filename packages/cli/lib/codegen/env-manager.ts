import { promises as fs } from "fs";
import { resolve } from "path";

interface VariableInfo {
  line: string;
  lineNumber: number;
}

interface UpdateResult {
  action: "updated" | "appended";
  line: string;
}

export class EnvError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "EnvError";
  }
}

export class EnvManager {
  private readonly envPath: string;

  constructor(envPath: string = ".env") {
    this.envPath = resolve(envPath);
  }

  /**
   * Reads and returns the content of the .env file
   * Creates the file if it doesn't exist
   */
  private async readEnvFile(): Promise<string> {
    try {
      await fs.access(this.envPath);
      return await fs.readFile(this.envPath, "utf8");
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        // File doesn't exist, create it
        await fs.writeFile(this.envPath, "");
        return "";
      }
      throw new EnvError(
        `Failed to read env file: ${error instanceof Error ? error.message : "Unknown error"}`,
        "READ_ERROR"
      );
    }
  }

  /**
   * Finds a variable in the .env file
   * @param varName - Name of the variable to find
   * @returns Variable info if found, null otherwise
   */
  public async findVariable(varName: string): Promise<VariableInfo | null> {
    try {
      const content = await this.readEnvFile();
      const lines = content.split("\n");
      const pattern = new RegExp(`^${this.escapeRegExp(varName)}\\s*=`);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (pattern.test(line)) {
          return { line, lineNumber: i };
        }
      }
      return null;
    } catch (error) {
      throw new EnvError(
        `Failed to find variable: ${error instanceof Error ? error.message : "Unknown error"}`,
        "FIND_ERROR"
      );
    }
  }

  /**
   * Updates an existing variable or appends a new one
   * @param varName - Name of the variable to update
   * @param newValue - New value for the variable
   * @returns Result of the update operation
   */
  public async updateVariable(
    varName: string,
    newValue: string
  ): Promise<UpdateResult> {
    try {
      const content = await this.readEnvFile();
      const lines = content.split("\n");
      const varInfo = await this.findVariable(varName);
      const newLine = `${varName}=${newValue}`;

      if (varInfo) {
        // Update existing variable
        lines[varInfo.lineNumber] = newLine;
        await fs.writeFile(this.envPath, lines.join("\n"));
        return { action: "updated", line: newLine };
      } else {
        // Append new variable
        const newContent =
          content + (content && !content.endsWith("\n") ? "\n" : "") + newLine;
        await fs.writeFile(this.envPath, newContent);
        return { action: "appended", line: newLine };
      }
    } catch (error) {
      throw new EnvError(
        `Failed to update variable: ${error instanceof Error ? error.message : "Unknown error"}`,
        "UPDATE_ERROR"
      );
    }
  }

  /**
   * Gets the value of a variable from the .env file
   * @param varName - Name of the variable to get
   * @returns Value of the variable if found, null otherwise
   */
  public async getVariable(varName: string): Promise<string | null> {
    try {
      const varInfo = await this.findVariable(varName);
      if (varInfo) {
        const [, value] = varInfo.line.split("=");
        return value.trim();
      }
      return null;
    } catch (error) {
      throw new EnvError(
        `Failed to get variable: ${error instanceof Error ? error.message : "Unknown error"}`,
        "GET_ERROR"
      );
    }
  }

  /**
   * Helper method to escape special characters in variable names
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
