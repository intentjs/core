import pc from 'picocolors';

export const colorizeJSON = (obj: Record<string, any>) => {
  const jsonString = JSON.stringify(obj, null, 2);
  return jsonString.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let coloredMatch = match;
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          // Key
          coloredMatch = pc.green(match);
        } else {
          // String
          coloredMatch = pc.yellow(match);
        }
      } else if (/true|false/.test(match)) {
        // Boolean
        coloredMatch = pc.blue(match);
      } else if (/null/.test(match)) {
        // Null
        coloredMatch = pc.magenta(match);
      } else {
        // Number
        coloredMatch = pc.cyan(match);
      }
      return coloredMatch;
    },
  );
};

export const jsonToArchy = (obj: Record<string, any>, key = '') => {
  if (typeof obj === 'function') {
    return `${pc.cyan(`${key}${key ? ': ' : ''}`)} ${pc.yellow('Function()')} ${pc.gray('(function)')}`;
  }
  if (typeof obj !== 'object' || obj === null) {
    const type = obj === null ? 'null' : typeof obj;
    const value = obj === null ? 'null' : JSON.stringify(obj);
    return `${pc.cyan(`${key}${key ? ': ' : ''}`)}${pc.yellow(value)} ${pc.gray(`(${type})`)}`;
  }

  const label = pc.cyan(key) || (Array.isArray(obj) ? 'Array' : 'Object');
  const nodes = Object.entries(obj).map(([k, v]) => jsonToArchy(v, k));

  return { label, nodes };
};
