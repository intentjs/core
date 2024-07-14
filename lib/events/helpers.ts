import { EmitsEvent } from "./event";

export async function EmitEvent(event: EmitsEvent): Promise<void> {
  await event.emit();
  return;
}

export function difference<T>(arr1: T[], arr2: T[]): T[] {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return [];
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
