import inquirer from "inquirer";

export class Inquirer {
  /**
   * Use this method to ask the client about any input.
   * @param question
   * @returns Promise<string>
   */
  static async ask(question: string, defaultVal?: string): Promise<string> {
    const answers = await inquirer.prompt([
      { name: "question", message: question, default: defaultVal },
    ]);
    return answers.question;
  }

  /**
   * Use this method to ask for confirmation from the client
   * @param question
   */
  static async confirm(
    message: string,
    defaultVal?: boolean
  ): Promise<boolean> {
    const answer = await inquirer.prompt([
      {
        name: "confirm_once",
        message,
        type: "confirm",
        default: defaultVal || true,
      },
    ]);

    return answer.confirm_once;
  }

  /**
   * Use this method to let the client select option from given choices
   * @param question
   * @param choices
   * @returns Promise<string>
   */
  static async select(
    message: string,
    choices: string[],
    multiple = false,
    defaultVal?: string[]
  ): Promise<string | string[]> {
    const type = multiple ? "checkbox" : "list";
    const name = "command";
    const answers = await inquirer.prompt([
      { type, name, message, choices, default: defaultVal },
    ]);
    return answers.command;
  }

  /**
   * Use this method to ask for a password/hidden input from the client
   * @param question
   * @param mask
   */
  static async password(
    message: string,
    mask = "",
    defaultVal?: string
  ): Promise<string> {
    const type = "password",
      name = "command";
    const answers = await inquirer.prompt([
      { type, name, message, mask, default: defaultVal },
    ]);
    return answers[name];
  }
}
