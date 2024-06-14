export class ExpParser {
  private parsedExp: Array<any>;
  constructor(private exp: string) {
    this.parsedExp = [];
  }

  static from(exp: string): ExpParser {
    const parser = new ExpParser(exp);
    parser.handle();
    return parser;
  }

  private handle(): this {
    let o = {};
    let p = [];
    let inArray = false;
    const presenter = [];

    const length = this.exp.length;
    let i = 0;
    while (i < length) {
      const lastChar = this.exp.charCodeAt(i - 1);
      const ch = this.exp.charCodeAt(i);
      if (ch === 91) {
        o['name'] = p.join('');
        o['args'] = [];
        p = [];
        inArray = true;
      } else if (inArray && ch === 44) {
        o['args'].push(p.join(''));
        p = [];
      } else if (ch === 93) {
        o['args'].push(p.join(''));
        presenter.push(o);
        o = {};
        p = [];
        inArray = false;
      } else if (lastChar !== 93 && ch === 44) {
        o['name'] = p.join('');
        presenter.push(o);
        o = {};
        p = [];
      } else if (ch !== 93 && length - i == 1) {
        p.push(String.fromCharCode(ch));
        o['name'] = p.join('');
        presenter.push(o);
      } else if (ch !== 44) {
        p.push(String.fromCharCode(ch));
      }

      i++;
    }

    this.parsedExp = presenter;

    return this;
  }

  static buildFromObj(inputs: Record<string, any>): string {
    for (const key in inputs) {
      const type = typeof inputs[key];
      if (type === 'string' || type === 'number') {
        inputs[key] = [inputs[key]];
      }
    }

    const keys = Object.keys(inputs).sort();
    let str = '';
    for (const key of keys) {
      str += `,${key}`;
      if (Array.isArray(inputs[key]) && inputs[key].length > 0) {
        const values = inputs[key].sort();
        str += `[${values.join(',')}]`;
      }
    }

    return str.slice(1);
  }

  toObj(): Record<string, any> {
    const obj = {};
    for (const o of this.parsedExp) {
      obj[o.name] = o.args;
    }

    return obj;
  }

  toArr(): Array<Record<string, any>> {
    return this.parsedExp;
  }
}
