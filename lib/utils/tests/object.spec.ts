import { InvalidValue } from '../../exceptions';
import { Obj } from '../object';

jest.mock('../../config/service');

describe('Object Helper', () => {
  beforeEach(async () => {});

  //   it('should throw exception', () => {
  //     const arr = {};
  //     expect(Arr.toObj(arr as [], [])).toThrow(InvalidValue);
  //   });

  it('should return flattened object with dot notation', () => {
    const obj = {
      product: { price: 20, tags: [{ name: 'good' }] },
      name: 'piyush',
    };
    expect(Obj.dot(obj)).toStrictEqual({
      'product.price': 20,
      name: 'piyush',
      'product.tags': [{ name: 'good' }],
    });
  });

  it('should return flattened object in array format with dot notation', () => {
    const obj = {
      product: { price: 20, tags: [{ name: 'good' }] },
      name: 'piyush',
    };
    expect(Obj.entries(obj)).toStrictEqual([
      ['product.price', 20],
      ['product.tags', [{ name: 'good' }]],
      ['name', 'piyush'],
    ]);
  });

  it('should return object with all string values trimmed', () => {
    const obj = {
      product: { price: 20, name: '  Intent', tags: [{ name: ' good ' }] },
      name: '   piyush  ',
    };
    expect(Obj.trim(obj)).toStrictEqual({
      product: { price: 20, name: 'Intent', tags: [{ name: ' good ' }] },
      name: 'piyush',
    });
  });

  it('should return false for empty and true for notEmpty', () => {
    const obj = {
      product: { price: 20, name: 'Intent', tags: [{ name: ' good ' }] },
      name: 'piyush',
    };
    expect(Obj.isEmpty(obj)).toBeFalsy();
    expect(Obj.isNotEmpty(obj)).toBeTruthy();
  });

  it('should return true for empty and false for notEmpty', () => {
    const obj = {};
    expect(Obj.isEmpty(obj)).toBeTruthy();
    expect(Obj.isNotEmpty(obj)).toBeFalsy();
  });

  it('should return object as a map', () => {
    const obj = {
      product: { price: 20, name: 'Intent', tags: [{ name: ' good ' }] },
      name: 'piyush',
    };
    const map = new Map();
    map.set('product', {
      price: 20,
      name: 'Intent',
      tags: [{ name: ' good ' }],
    });
    map.set('name', 'piyush');
    expect(Obj.asMap(obj)).toStrictEqual(map);
  });

  it('should return true', () => {
    const obj = {
      product: {
        price: 20,
        name: 'Intent',
        tags: [{ name: ' good ' }],
      },
      name: 'piyush',
    };
    expect(Obj.isObj(obj)).toBeTruthy();
  });

  it('should return false', () => {
    const obj = true;
    expect(Obj.isObj(obj)).toBeFalsy();
  });

  it('should throw exception', () => {
    const run = () => {
      const obj = true;
      Obj.isObj(obj, true);
    };
    expect(run).toThrow(InvalidValue);
  });

  it('should return value of key', () => {
    const obj = {
      product: {
        price: 20,
        name: 'Intent',
        tags: [{ name: ' good ' }],
      },
      name: 'piyush',
    };
    expect(Obj.get(obj, 'name')).toBe('piyush');
  });

  it('should return undefined', () => {
    const obj = {
      product: {
        price: 20,
        name: 'Intent',
        tags: [{ name: ' good ' }],
      },
      name: 'piyush',
    };
    expect(Obj.get(obj, 'foo')).toBe(undefined);
  });

  it('should return default value', () => {
    const obj = {
      product: {
        price: 20,
        name: 'Intent',
        tags: [{ name: ' good ' }],
      },
      name: 'piyush',
    };
    expect(Obj.get(obj, 'foo', 'bar')).toBe('bar');
  });

  it('should return object with sorted keys and sorted values', () => {
    const obj = {
      product: {
        price: 20,
        name: 'Intent',
        tags: [{ name: ' good ' }],
      },
      name: 'piyush',
    };
    expect(Obj.sort(obj)).toStrictEqual({
      name: 'piyush',
      product: { name: 'Intent', price: 20, tags: [{ name: ' good ' }] },
    });
  });

  it('should return objects with keys only mentioned to pick', () => {
    const obj = {
      product: {
        price: 20,
        name: 'Intent',
        tags: [{ name: ' good ', time: 3 }],
      },
      name: 'piyush',
    };
    const pick = ['product.tags.*.time', 'name'];
    expect(Obj.pick(obj, pick)).toStrictEqual({
      name: 'piyush',
      product: { tags: [{ time: 3 }] },
    });
  });

  it('should return objects with all keys but the mentioned ones to leave', () => {
    const obj = {
      product: {
        price: 20,
        name: 'Intent',
        tags: [{ name: ' good ', time: 3 }],
      },
      name: 'piyush',
    };
    const leave = ['product.tags.*.time', 'name'];
    expect(Obj.except(obj, leave)).toStrictEqual({
      product: { name: 'Intent', price: 20, tags: [{ name: ' good ' }] },
    });
  });

  it('should return objects with keys only mentioned to pick', () => {
    const obj = {
      product: {
        price: 20,
        name: 'Intent',
        tags: [{ name: ' good ', time: 3 }],
      },
      name: 'piyush',
    };
    const pick = ['product.tags.*.times', 'name'];
    expect(Obj.pick(obj, pick)).toStrictEqual({
      name: 'piyush',
      product: { tags: [{}] },
    });
  });

  it('should return objects with all keys but the mentioned ones to leave', () => {
    const obj = {
      product: {
        price: 20,
        name: 'Intent',
        tags: [{ name: ' good ', time: 3 }],
      },
      name: 'piyush',
    };
    const leave = ['product.tags.*.times', 'name'];
    expect(Obj.except(obj, leave)).toStrictEqual({
      product: {
        name: 'Intent',
        price: 20,
        tags: [{ name: ' good ', time: 3 }],
      },
    });
  });
});
