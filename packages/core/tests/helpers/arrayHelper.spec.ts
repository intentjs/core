import { Arr } from '../../lib/utils/array';

describe('Array Helper', () => {
  beforeEach(async () => {});

  it('check key exists', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(Arr.exists(arr, 2)).toBeTruthy();
  });

  it('check key does not exist', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(Arr.exists(arr, 6)).toBeFalsy();
  });
});
