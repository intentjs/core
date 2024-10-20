import { Str } from '../string';

jest.mock('../../config/service');

describe('String Helper', () => {
  beforeEach(async () => {});

  it('returns the part of the string present after the passed delimiter', () => {
    const string = Str.after('Hello, World!!', ',');
    expect(string).toBe(' World!!');
  });

  it('returns the part of the string befored the passed delimiter', () => {
    const string = Str.before('Hello, World!!', ',');
    expect(string).toBe('Hello');
  });

  it('compares the string with pattern', () => {
    const string = 'users:create';
    const patterns = { 'users:create': true, '*:create': true, admin: false };
    for (const pattern in patterns) {
      expect(Str.is(string, pattern)).toBe(patterns[pattern]);
    }
  });

  it('returns the string present between the specified stat and end delimiters', () => {
    const sentence = 'The quick brown fox jumps over a lazy dog.';
    const result = Str.between(sentence, 'brown', 'jumps');
    expect(result).toBe(' fox ');
  });

  it('converts the string to a camelCase', () => {
    const samples = {
      intent_js: 'intentJs',
      'quick brown fox jumps': 'quickBrownFoxJumps',
      // "Hey_there, What's up?": 'heyThereWhatSUp',
    };
    for (const str in samples) {
      expect(Str.camel(str)).toBe(samples[str]);
    }
  });

  it('check if string contains the specified string', () => {
    const samples = { over: true, over2: false };
    const sentence = 'The quick brown fox jumps over a lazy dog.';

    for (const sample in samples) {
      expect(Str.contains(sentence, sample)).toBe(samples[sample]);
    }
  });

  it('check if string contains all specified strings', () => {
    const sentence = 'The quick brown fox jumps over a lazy dog.';
    expect(Str.containsAll(sentence, ['fox', 'dog'])).toBe(true);
    expect(Str.containsAll(sentence, ['fox', 'whale'])).toBe(false);
  });

  it('returns true if string ends with the specified delimitter', () => {
    const sentence = 'The quick brown fox jumps over a lazy dog.';
    expect(Str.endsWith(sentence, 'dog.')).toBe(true);
  });

  it('returns false if string ends with the specified delimitter', () => {
    const sentence = 'The quick brown fox jumps over a lazy dog.';
    expect(Str.endsWith(sentence, 'dog2.')).toBe(false);
  });

  it('should return the string to headline', () => {
    const sentence = 'Is this real?';
    expect(Str.headline(sentence)).toBe('Is This Real?');
  });

  it('should validate if the string is email or not', () => {
    const samples = {
      'hi@tryintent.com': true,
      'tryintent.com': false,
    };
    for (const email in samples) {
      expect(Str.isEmail(email)).toStrictEqual(samples[email]);
    }
  });

  it('should validate if the given string is a valid JSON or not', () => {
    const samples = {
      '{"name": "Intent"}': true,
      '{"name": "Intent"': false,
    };

    for (const json in samples) {
      expect(Str.isJson(json)).toStrictEqual(samples[json]);
    }
  });

  it('should validate if the string is a valid URL or not', () => {
    const samples = {
      'https://tryintent.com': true,
      'tryintent.com': true,
      'docs.tryintent.com': true,
      'http2://tryintent.com': false,
    };

    for (const url in samples) {
      expect(Str.isUrl(url)).toStrictEqual(samples[url]);
    }
  });

  it('should validate if the string is valid ulid or not', () => {
    const samples = {
      ABCDOKMK: false,
      '01ARZ3NDEKTSV4RRFFQ69G5FAV': true,
    };
    for (const ulid in samples) {
      expect(Str.isUlid(ulid)).toStrictEqual(samples[ulid]);
    }
  });

  it('should transform the string to kebab case', () => {
    const samples = {
      intent_js: 'intent-js',
      'quick brown fox jumps': 'quick-brown-fox-jumps',
      "Hey_there, What's up?": 'hey-there-what-s-up',
    };
    for (const str in samples) {
      expect(Str.kebab(str)).toStrictEqual(samples[str]);
    }
  });

  it('should convert the first character of a string to lowercase', () => {
    const samples = {
      INTENT: 'iNTENT',
      Intent: 'intent',
    };
    for (const str in samples) {
      expect(Str.lcfirst(str)).toStrictEqual(samples[str]);
    }
  });

  it('returns the correct length of a string', () => {
    expect(Str.len('intent')).toStrictEqual(6);
    expect(Str.len(undefined)).toStrictEqual(0);
  });

  it('should returns only `n` length of character for a given string', () => {
    const sentence = 'The quick brown fox jumps over a lazy dog.';
    expect(Str.limit(sentence, 15)).toStrictEqual('The quick brown...');
    expect(Str.limit(sentence, 15, '!!!')).toStrictEqual('The quick brown!!!');
    expect(Str.limit(sentence, 500)).toStrictEqual(sentence);
  });

  it('should converts the string to lowercase', () => {
    expect(Str.lower('HEY THERE!!')).toStrictEqual('hey there!!');
  });

  it('should mask the string after certain characters', () => {
    expect(Str.mask('hi@tryintent.com', '*', 7)).toStrictEqual(
      'hi@tryi*********',
    );
  });

  it('should pad both ends of the string with character to a defined length', () => {
    expect(Str.padBoth('intent', 10, '--')).toStrictEqual('--intent--');
  });

  it('should only pad left of the string with character to a defined length', () => {
    expect(Str.padLeft('intent', 10, '--')).toStrictEqual('----intent');
  });

  it('should only pad right of the string with character to a defined length', () => {
    expect(Str.padRight('intent', 10, '--')).toStrictEqual('intent----');
  });

  it('should remove the given substring in a given string', () => {
    const sentence = 'The quick brown fox jumps over a lazy dog.';
    expect(Str.remove(sentence, 'quick ')).toStrictEqual(
      'The brown fox jumps over a lazy dog.',
    );
    expect(Str.remove(sentence, ' ')).toStrictEqual(
      'Thequickbrownfoxjumpsoveralazydog.',
    );
  });

  it('should repeat the given string defined number of times.', () => {
    expect(Str.repeat('chug ', 5)).toStrictEqual('chug chug chug chug chug ');
  });

  it('should replace the given string with another string', () => {
    expect(Str.replace('I hate intent!', 'hate', 'love')).toStrictEqual(
      'I love intent!',
    );
    expect(Str.replace('I Hate intent!', 'hate', 'love', true)).toStrictEqual(
      'I love intent!',
    );
  });

  it('should replace the matching string sequentially with the string array', () => {
    const str = 'I will be there between ? and ?';
    expect(Str.replaceArray(str, '?', ['8:30', '9:30PM'])).toStrictEqual(
      'I will be there between 8:30 and 9:30PM',
    );
  });

  it('should only replace the first matching string with the the replacement string', () => {
    const sentence = 'the quick brown fox jumps over the lazy dog.';
    expect(Str.replaceFirst(sentence, 'the', 'a')).toStrictEqual(
      'a quick brown fox jumps over the lazy dog.',
    );
  });

  it('should only replace the last matching string with the the replacement string', () => {
    const sentence = 'the quick brown fox jumps over the lazy dog.';
    expect(Str.replaceLast(sentence, 'the', 'a')).toStrictEqual(
      'the quick brown fox jumps over a lazy dog.',
    );
  });

  it('should correctly reverse the given string', () => {
    expect(Str.reverse('wtf! why reverse?')).toStrictEqual('?esrever yhw !ftw');
  });

  it('should pluralize the sentence', () => {
    const string = `Vinayak ${Str.pluralize('have')} 5 ${Str.pluralize(
      'apple',
    )}.`;
    expect(string).toBe('Vinayak has 5 apples.');
  });

  it('should replace using string', () => {
    const string = 'vinayak don';
    const find = 'don';
    const replace = 'sarawagi';
    expect(Str.replace(string, find, replace)).toBe('vinayak sarawagi');
  });

  it('should replace using regex', () => {
    const string = 'vinayak don';
    const find = 'don';
    const replace = 'sarawagi';
    expect(Str.replace(string, find, replace)).toBe('vinayak sarawagi');
  });

  it('should replace all occurences using string', () => {
    const string = 'vinayak don don don don';
    const find = 'don';
    const replace = 'sarawagi';
    expect(Str.replace(string, find, replace)).toBe(
      'vinayak sarawagi sarawagi sarawagi sarawagi',
    );
  });

  it('should replace all occurences using regex', () => {
    const string = 'Virat Kohli says Ben Stokes';
    const replacements = {
      'Ben Stokes': 'OUT!!',
    };
    expect(Str.swap(string, replacements)).toBe('Virat Kohli says OUT!!');
  });

  it('should convert to snake case', () => {
    const string = 'IntentJs - For the devs_whoHaveTheIntent';
    expect(Str.snake(string)).toBe(
      'intent_js_for_the_devs_who_have_the_intent',
    );
  });

  it('should singularize', () => {
    expect(Str.singular('indices')).toBe('index');
  });
});
