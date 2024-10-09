import { Arr } from '../../lib/utils/array';

describe('Array Helper', () => {
  beforeEach(async () => {});

  //   it('should throw exception', () => {
  //     const arr = {};
  //     expect(Arr.toObj(arr as [], [])).toThrow(InvalidValue);
  //   });

  it('should return object', () => {
    const arr = [
      2,
      ['bar', 'piyush', 'intent'],
      {
        foo: 'bar',
      },
      [{ bar: 'foo' }],
    ];
    const keys = ['foo', 'chhabra', 'best framework', 'obj'];
    expect(Arr.toObj(arr, keys)).toStrictEqual([
      {
        foo: 'bar',
        chhabra: 'piyush',
        'best framework': 'intent',
      },
      {
        foo: { bar: 'foo' },
      },
    ]);
  });

  //   it('should throw exception', () => {
  //     const arr = {};
  //     expect(Arr.isArray(arr as [], true)).toThrow(InvalidValue);
  //   });

  it('should return false', () => {
    const arr = {};
    expect(Arr.isArray(arr as [])).toBeFalsy();
  });

  it('should return false', () => {
    const arr = [];
    expect(Arr.isArray(arr)).toBeTruthy();
  });

  it('should return array of nested members flattened', () => {
    const arr = [1, [2, 3, 4], [[5, 6], [[7], 8], 9]];
    expect(Arr.collapse(arr)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should return array with random order of input', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;
    expect(Arr.random(arr)).toStrictEqual([1, 6, 2, 8, 3, 7, 4, 9, 5]);
  });

  it('should return array with sorted order of input', () => {
    const arr = [6, 1, 2, 8, 3, 7, 4, 9, 5];
    expect(Arr.sort(arr)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should return array with descending order of input', () => {
    const arr = [6, 1, 2, 8, 3, 7, 4, 9, 5];
    expect(Arr.sortDesc(arr)).toStrictEqual([9, 8, 7, 6, 5, 4, 3, 2, 1]);
  });

  it('should return array with common elements from both input arrays', () => {
    const arr1 = [1, 2, 3, 4, 5];
    const arr2 = [4, 5, 6, 7, 8];
    expect(Arr.intersect(arr1, arr2)).toStrictEqual([4, 5]);
  });

  it('should return array with elements keys mentioned to pick', () => {
    const arr = [
      { developer: { id: 1, name: 'Taylor' } },
      { developer: { id: 2, name: 'Abigail' } },
    ];
    const pick = ['*.developer.name'];
    expect(Arr.pick(arr, pick)).toStrictEqual([
      { developer: { name: 'Taylor' } },
      { developer: { name: 'Abigail' } },
    ]);
  });

  it('should return array with all elements except the keys mentioned', () => {
    const arr = [
      { developer: { id: 1, name: 'Taylor' } },
      { developer: { id: 2, name: 'Abigail' } },
    ];
    const pick = ['*.developer.name'];
    expect(Arr.except(arr, pick)).toStrictEqual([
      { developer: { id: 1 } },
      { developer: { id: 2 } },
    ]);
  });
});
