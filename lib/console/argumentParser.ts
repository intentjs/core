import { ArgumentOptionObject, ArgumentParserOutput } from './interfaces';

export class ArgumentParser {
  constructor(private exp: string) {}

  static from(exp: string): ArgumentParserOutput {
    const parser = new ArgumentParser(exp);
    return parser.handle();
  }

  private handle(): ArgumentParserOutput {
    const words = this.exp.split(' ');
    const obj: ArgumentParserOutput = {
      name: words.splice(0, 1)[0],
      arguments: [],
      options: [],
      meta: { desc: '' },
    };

    for (const word of words) {
      if (!word) continue;
      const input = word.substring(1, word.length - 1);

      // check if inputName starts with "--"
      const startsWithDoubleHyphen = input.substring(0, 2) === '--';
      startsWithDoubleHyphen
        ? obj.options.push({
            ...this.parseExpression(input.substring(2)),
            isRequired: false,
          })
        : obj.arguments.push(this.parseExpression(input));
    }

    return obj;
  }

  parseExpression(expression: string): ArgumentOptionObject {
    const [arg, defaultValue = null] = expression.split('=');

    const specialCharMatch = arg.match(/[?\*]/i);
    return {
      name: specialCharMatch
        ? arg.substring(0, arg.indexOf(specialCharMatch[0]))
        : arg,
      isRequired: !!!arg.includes('?'),
      isArray: arg.includes('*'),
      defaultValue:
        defaultValue != undefined ? defaultValue : 'secret_default_value',
      expression,
    };
  }
}
