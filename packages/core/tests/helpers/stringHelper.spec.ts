import { Str } from '../../lib/utils/string';

describe('String Helper', () => {
  beforeEach(async () => {});

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
