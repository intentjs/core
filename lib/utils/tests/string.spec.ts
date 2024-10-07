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
