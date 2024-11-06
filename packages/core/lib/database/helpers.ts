export function pick(
  obj: Record<string, any>,
  props: string | string[],
): Record<string, any> {
  const newObj = {} as Record<string, any>;
  if (typeof props === 'string' && obj.hasOwnProperty(props)) {
    newObj[props] = obj[props];
  }

  if (Array.isArray(props)) {
    for (const prop of props) {
      if (obj.hasOwnProperty(prop)) {
        newObj[prop] = obj[prop];
      }
    }
  }

  return newObj;
}
