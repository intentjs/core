import { Arr } from '../array';

jest.mock('../../config/service');

describe('Object Helpers', () => {
  beforeEach(async () => {});

  it('should collapse a nested array in a single level array', () => {
    const sample1 = ['a', ['b', ['c'], 1], 2];
    expect(Arr.collapse(sample1)).toStrictEqual(['a', 'b', 'c', 1, 2]);
  });
});
