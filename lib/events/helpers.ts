import { EmitsEvent } from './event';

/**
 * Check if value is of type object.
 *
 * @param value
 */
export function isObject(value: any): boolean {
  if (typeof value === 'object' && value !== null) {
    return true;
  }
  return false;
}

/**
 * Check if value is of type array.
 * @param value
 */
export function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * Check if value is empty
 *
 * @param value
 */
export function isEmpty(value: any): boolean {
  if (Array.isArray(value) && value.length < 1) return true;
  if (isObject(value) && Object.keys(value).length < 1) return true;
  if (!value) return true;

  return false;
}

export async function EmitEvent(event: EmitsEvent): Promise<void> {
  await event.emit();
  return;
}

export function difference<T>(arr1: T[], arr2: T[]): T[] {
  if (!isArray(arr1) || !isArray(arr2)) return [];
  const keyMap = {} as Record<string, any>;
  const difference = [] as T[];
  for (const val of arr2) {
    keyMap[val as unknown as string] = true;
  }

  for (const val of arr1) {
    if (!keyMap[val as unknown as string]) {
      difference.push(val);
    }
  }

  return difference;
}

export class Package {
  static load(pkgName: string): any {
    try {
      return require(pkgName);
    } catch (e) {
      console.error(
        ` ${pkgName} is missing. Please make sure that you have installed and configured the package first`,
      );
      process.exitCode = 1;
      process.exit();
    }
  }
}
