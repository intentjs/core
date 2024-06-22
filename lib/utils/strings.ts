import { ConflictException } from "@nestjs/common";
import { Num } from "./number";
import { singularize, pluralize } from "./pluralise";

export class Str {
  static wordsArr = (str: string): string[] => {
    if (Str.len(str) == 0) return [];
    // escape (strip) unicodes
    const words = [];
    let word = "";
    for (const char of str) {
      if (["_", "-", " ", "/", "\\"].includes(char) || Str.isUpperCase(char)) {
        if (Str.len(word)) words.push(word);
        word = "";
        if (Str.isUpperCase(char)) word += char;
      } else {
        word += char;
      }
    }

    Str.len(word) && words.push(word);
    return words.map((key) => Str.lower(key));
  };

  static pascal = (str: string): string => {
    return Str.wordsArr(str).map(Str.ucfirst).join("");
  };

  static kebab = (str: string): string => {
    return Str.wordsArr(str).join("-");
  };

  static snake = (str: string): string => {
    return Str.wordsArr(str).join("_");
  };

  static camel = (str: string): string => {
    return Str.lcfirst(Str.wordsArr(str).map(Str.ucfirst).join(""));
  };

  static studly = (str: string): string => {
    return Str.wordsArr(str).map(Str.ucfirst).join("");
  };

  static headline = (str: string): string => {
    return Str.wordsArr(str).map(Str.ucfirst).join(" ");
  };

  static charAt = (str: string, idx: number) => {
    return str?.[idx] ?? "";
  };

  static isLowerCase = (str: string): boolean => {
    return Str.isAlpha(str) && Str.lower(str) === str;
  };

  static isUpperCase = (str: string): boolean => {
    return Str.isAlpha(str) && Str.upper(str) === str;
  };

  static isAlpha = (str: string): boolean => {
    for (let i = 0; i < Str.len(str); i++) {
      const char = str.charCodeAt(i);
      if (!Num.inRange(char, [97, 122]) && !Num.inRange(char, [65, 90])) {
        return false;
      }
    }
    return true;
  };

  static isString = (str: any): boolean => {
    return typeof str == "string";
  };

  static after = (text: string, subStr: string): string => {
    if (Str.len(subStr) < 1) return text;
    const index = text.indexOf(subStr);
    return index < 0 ? text : text.slice(index + Str.len(subStr));
  };

  static afterLast(text: string, subStr: string): string {
    return Str.reverse(Str.before(Str.reverse(text), Str.reverse(subStr)));
  }

  static before = (text: string, subStr: string): string => {
    if (Str.len(subStr) < 1) return text;
    const index = text.indexOf(subStr);
    return index < 0 ? text : text.slice(0, index);
  };

  static beforeLast(text: string, subStr: string): string {
    return Str.reverse(Str.after(Str.reverse(text), Str.reverse(subStr)));
  }

  static between = (
    text: string,
    startingSubStr: string,
    endingSubStr: string
  ): string => {
    let startIdx = 0;
    let endIdx = Str.len(text);
    if (Str.len(startingSubStr) > 0)
      startIdx = text.indexOf(startingSubStr) + Str.len(startingSubStr);
    if (Str.len(endingSubStr) > 0) endIdx = text.indexOf(endingSubStr);
    return text.slice(startIdx, endIdx);
  };

  static contains = (text: string, subStr: string): boolean => {
    return text.indexOf(subStr) > -1;
  };

  static containsAll = (text: string, subStrs: string[]): boolean => {
    for (const subStr of subStrs) {
      if (!Str.contains(text, subStr)) return false;
    }
    return true;
  };

  static endsWith = (text: string, subStr: string): boolean => {
    return text.slice(Str.len(text) - Str.len(subStr)) === subStr;
  };

  static isEmail = (email: string): boolean => {
    return (
      Str.lower(email)?.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) != null
    );
  };

  static isJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  static isUrl = (url: string): boolean => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(url);
  };

  static isUlid = (ulid: string): boolean => {
    const pattern = /^[0-9A-HJKMNP-TV-Z]{26}$/;
    return Str.isString(ulid) && pattern.test(ulid);
  };

  static lcfirst = (str: string): string => {
    if (Str.isNotString(str)) {
      throw new ConflictException("Not a string");
    }

    return (Str.lower(str?.[0]) ?? "") + (str?.slice(1) ?? "");
  };

  static isNotString = (value: any): boolean => {
    return !Str.isString(value);
  };

  static len = (str: string): number => {
    return str?.length ?? 0;
  };

  static ucfirst(str: string): string {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }

  static limit = (str: string, limit: number, suffix?: string): string => {
    return (
      str?.slice(0, limit) + (Str.len(str) >= limit ? suffix ?? "..." : "")
    );
  };

  static lower = (str: string) => {
    return str?.toLowerCase();
  };

  static upper = (str: string) => {
    return str?.toUpperCase();
  };

  static wrap = (middle: string, prefix: string, suffix?: string): string => {
    return prefix + middle + (suffix ?? prefix);
  };

  static title = (text: string): string => {
    return text
      .split(" ")
      .map(
        (word: string) =>
          (Str.upper(word?.[0]) ?? "") + (Str.lower(word?.slice(1)) ?? "")
      )
      .join(" ");
  };

  static replace(
    str: string,
    findStr: string | RegExp,
    replaceStr: string | ((substring: string, ...args: any[]) => string),
    caseInsensitive?: boolean
  ): string {
    const regexFlags = ["g"];
    caseInsensitive && regexFlags.push("i");
    const pattern = new RegExp(findStr, regexFlags.join(""));
    return str.replace(pattern, replaceStr as string);
  }

  static replaceArray(
    str: string,
    identifier: string,
    values: Array<string | number>
  ): string {
    const words = str.split(" ");
    const newWordsArr = [];
    let i = 0;
    for (const word of words) {
      if (word === "") newWordsArr.push(" ");
      else if (word === identifier) newWordsArr.push(values[i++]);
      else newWordsArr.push(word);
    }
    return newWordsArr.join(" ");
  }

  static replaceFirst(
    str: string,
    oldValue: string | RegExp,
    newValue: string | number
  ): string {
    console.log(str, oldValue, newValue);
    // return str.replace();
    return "";
  }

  static replaceLast(
    str: string,
    oldValue: string | RegExp,
    newValue: string | number
  ): string {
    console.log(str, oldValue, newValue);
    // return str.replace();
    return "";
  }

  static mask(str: string, mask: string, leave: number): string {
    const substr = str.slice(0, leave);
    return substr.padEnd(Str.len(str), mask);
  }

  static remove(str: string, remove: string): string {
    return str.split(remove).join("");
  }

  static repeat(repeat: string, times: number): string {
    let newStr = "";
    let i = 1;
    while (i <= times) {
      newStr += repeat;
      i++;
    }

    return newStr;
  }

  static reverse(str: string): string {
    let newStr = "";
    for (let i = Str.len(str) - 1; i >= 0; i--) {
      newStr += str.charAt(i);
    }
    return newStr;
  }

  static swap(str: string, swapVals: Record<string, any>): string {
    let newStr = str;
    for (const key in swapVals) {
      newStr = Str.replace(newStr, key, swapVals[key]);
    }
    return newStr;
  }

  static toBase64(str: string): string {
    return Buffer.from(str).toString("base64");
  }

  static toBase64Url(str: string): string {
    return Buffer.from(str).toString("base64url");
  }

  static fromBase64(str: string): string {
    return Buffer.from(str, "base64").toString();
  }

  static ucsplit(str: string): string[] {
    const newStr = [];
    let substr = "";
    for (let i = 0; i < Str.len(str); i++) {
      if (Num.inRange(str.charCodeAt(i), [65, 90])) {
        if (substr != "") {
          newStr.push(substr);
        }
        substr = str.charAt(i);
      } else {
        substr += str.charAt(i);
      }
    }
    newStr.push(substr);
    return newStr;
  }

  // buggy
  static squish(str: string): string {
    let newStr = "";
    let nextChar = "";
    for (let i = 0; i < Str.len(str); i++) {
      const char = str.charAt(i);
      nextChar = str.charAt(i + 1);
      if (char !== " ") {
        newStr += char;
      }

      if (char != " " && nextChar == " " && i !== Str.len(str) - 1) {
        newStr += " ";
      }
    }

    return newStr;
  }

  static startsWith(str: string, startStr: string): boolean {
    return str.slice(0, Str.len(startStr)) === startStr;
  }

  static finish(str: string, finishStr: string): string {
    return Str.endsWith(str, finishStr) ? str : str + finishStr;
  }

  static start(str: string, startStr: string): string {
    return Str.startsWith(str, startStr) ? str : str + startStr;
  }

  static is(str: string, pattern: string): boolean {
    if (str === pattern) return true;
    let regex = "^";
    for (const p of pattern) {
      regex += p === "*" ? ".*" : p;
    }
    const regexp = new RegExp(regex + "$", "g");
    return regexp.test(str);
  }

  static padBoth(str: string, maxLength: number, char = " "): string {
    const len = maxLength - Str.len(str);
    if (len > 0)
      return str
        .padStart(Math.floor(len / 2) + Str.len(str), char)
        .padEnd(Math.ceil(len / 2) + Str.len(str), char);
    return str;
  }

  static padLeft(str: string, maxLength: number, char = " "): string {
    return str.padStart(maxLength, char);
  }

  static padRight(str: string, maxLength: number, char = " "): string {
    return str.padEnd(maxLength, char);
  }

  static position(str: string, subStr: string): number {
    return str.indexOf(subStr);
  }

  static replaceMatches(str: string, patern: string, replace: string): string {
    return str.replace(patern, replace);
  }

  static slug(str: string, delimiter = "-"): string {
    return String(str)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, delimiter)
      .replace(/-+/g, delimiter);
  }

  static take(str: string, length: number): string {
    return str.slice(length);
  }

  static wordCount(str: string): number {
    return Str.wordsArr(str).length;
  }

  static words(str: string, count: number, suffix: string): string {
    const arr = str.split(" ");
    return (
      arr.slice(count).join(" ") + (arr.length > count ? " " + suffix : "")
    );
  }

  static wordWrap(str: string, characters: number, subStr: string): string {
    const arr = [];
    for (let i = 0; i < this.len(str); i += characters) {
      arr.push(str.slice(i, i + characters));
    }
    return arr.join(subStr);
  }

  static unwrap(str: string, prefix: string, suffix?: string): string {
    let start = 0;
    let end = Str.len(str);
    while (str[start] == prefix) {
      start += 1;
    }
    while (str[end - 1] == suffix ?? prefix) {
      end -= 1;
    }
    return str.slice(start, end);
  }

  static random(length: number): string {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  static equals(str1: string, str2: string): boolean {
    return typeof str1 === "string" && str1 === str2;
  }

  static isSentenceCase = (value: string): boolean => {
    return Str.isUpperCase(value[0]);
  };

  static trim = (value: string): string => {
    return value?.trim();
  };

  static pluralize = pluralize;

  static singularize = singularize;
}
