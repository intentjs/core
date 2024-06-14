import { InvalidValue } from '../exceptions';
import { Obj } from './object';

export class Arr {
  static toObj(
    nestedArray: Array<any>,
    keyIndexMap: string[],
  ): Record<string, any>[] {
    Arr.isArray(nestedArray, true);

    const objArr = [];
    for (const arr of nestedArray) {
      if (!Arr.isArray(arr)) {
        continue;
      }

      const obj = {} as Record<string, any>;
      for (const [index, value] of arr.entries()) {
        obj[keyIndexMap[index]] = value;
      }

      objArr.push(obj);
    }

    return objArr;
  }

  static isArray(value: any, throwError = false): boolean {
    if (Array.isArray(value)) return true;

    if (throwError) {
      throw new InvalidValue('Passed value is not an object');
    }

    return false;
  }

  static collapse(arr: any[]): any[] {
    const newArr = [];
    for (const el of arr) {
      if (Arr.isArray(el)) {
        newArr.push(...Arr.collapse(el));
      } else {
        newArr.push(el);
      }
    }
    return newArr;
  }

  static random<T>(arr: T[]): T[] {
    let currentIndex = arr.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [arr[currentIndex], arr[randomIndex]] = [
        arr[randomIndex],
        arr[currentIndex],
      ];
    }

    return arr;
  }

  static sort<T>(arr: T[]): T[] {
    return arr.sort();
  }

  static sortDesc(arr: any[]): any[] {
    return arr.sort((a, b) => b - a);
  }

  static pick<T = any>(arr: T[], props: Array<string>): T[] {
    const newArr = [];
    for (const prop of props) {
      const propArr = prop.split('.');
      let startIndex = propArr[0] === '*' ? 0 : +propArr[0];
      const endIndex = propArr[0] === '*' ? arr.length - 1 : +propArr[0];

      while (startIndex <= endIndex) {
        const newPropsArr = [propArr.slice(1).join('.')];
        if (Obj.isObj(arr[startIndex])) {
          newArr[startIndex] = Obj.pick(arr[startIndex], newPropsArr);
        }

        if (Array.isArray(arr[startIndex])) {
          newArr[startIndex] = Arr.pick(arr[startIndex] as T[], newPropsArr);
        }
        startIndex++;
      }
    }

    return newArr;
  }

  static except<T = any>(arr: T[], props: Array<string>): T[] {
    let newArr = [...arr];
    for (const prop of props) {
      const propArr = prop.split('.');
      let startIndex = propArr[0] === '*' ? 0 : +propArr[0];
      const endIndex = propArr[0] === '*' ? arr.length - 1 : +propArr[0];

      while (startIndex <= endIndex) {
        if (!propArr[1]) {
          newArr = arr.splice(startIndex, 1);
          startIndex++;
          continue;
        }

        const newPropsArr = [propArr.slice(1).join('.')];
        if (Obj.isObj(arr[startIndex])) {
          newArr[startIndex] = Obj.except(arr[startIndex], newPropsArr);
        }

        if (Array.isArray(arr[startIndex])) {
          newArr[startIndex] = Arr.except(
            arr[startIndex] as T[],
            newPropsArr,
          ) as T;
        }

        startIndex++;
      }
    }
    return newArr;
  }

  // static crossJoin(...arrays: any[][]):any

  static intersect<T = string | number, M = T>(
    arr1: T[],
    arr2: M[],
  ): Array<T | M> {
    const tempMap = new Map<T | M, number>();
    const newArr = [] as Array<T | M>;
    for (const val of arr1) {
      tempMap.set(val, 1);
    }

    for (const val2 of arr2) {
      if (tempMap.has(val2)) newArr.push(val2);
    }

    return newArr;
  }
}
