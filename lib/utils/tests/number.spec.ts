import { Num } from '../number';

jest.mock('../../config/service');

describe('Number Helpers', () => {
  beforeEach(async () => {});

  it('abbreviates the passed number to abbreviated format', () => {
    const num = 1000;
    expect(Num.abbreviate(num)).toStrictEqual('1K');
  });

  it('abbreviates the passed number to a abbreviated format, but with precision', () => {
    const num = 1200;
    expect(Num.abbreviate(num, { precision: 2 })).toStrictEqual('1.2K');
  });

  it('abbreviates the passed number to a abbreviated format, but with different locale', () => {
    const num = 1200;
    expect(Num.abbreviate(num, { locale: 'hi' })).toStrictEqual('1.2 हज़ार');
  });

  it('should conver the number to indian currency format', () => {
    const num = 12300;
    expect(Num.currency(num, { currency: 'INR' })).toStrictEqual('₹12,300.00');
  });

  it('should conver the number to dollar currency format', () => {
    const num = 12300;
    expect(Num.currency(num, { currency: 'USD' })).toStrictEqual('$12,300.00');
  });

  it('should convert the number to file size representation', () => {
    const samples = { 1000: '1KB', 1024: '1KB', [1024 * 1024 * 1.5]: '1.57MB' };
    expect(Num.fileSize(1000)).toStrictEqual('1KB');
    expect(Num.fileSize(1024)).toStrictEqual('1KB');
    expect(Num.fileSize(1024 * 1024 * 1.5, { precision: 2 })).toStrictEqual(
      '1.57MB',
    );
  });

  it('should convert the number to human readable format', () => {
    expect(Num.forHumans(100)).toStrictEqual('100');
    expect(Num.forHumans(1200)).toStrictEqual('1.2 thousand');
  });

  it('should convert the number to human readable format, with precision', () => {
    expect(Num.forHumans(1230, { precision: 2 })).toStrictEqual(
      '1.23 thousand',
    );
  });

  it('should convert the number to human readable format, with locale', () => {
    expect(Num.forHumans(1200, { locale: 'fr' })).toStrictEqual('1,2 millier');
  });

  it('should format the number to the given locale string', () => {
    expect(Num.format(1000)).toStrictEqual('1,000');
    expect(Num.format(1000, { locale: 'fr' })).toStrictEqual('1 000');
    expect(Num.format(1200)).toStrictEqual('1,200');
  });

  it('converts the given number to the ordinal format', () => {
    expect(Num.ordinal(1)).toStrictEqual('1st');
    expect(Num.ordinal(2)).toStrictEqual('2nd');
    expect(Num.ordinal(3)).toStrictEqual('3rd');
    expect(Num.ordinal(20)).toStrictEqual('20th');
  });

  it('converts the number to a percentage format with support for precision and locale config', () => {
    expect(Num.percentage(10)).toStrictEqual('10.0%');
    expect(Num.percentage(10, { locale: 'fr' })).toStrictEqual('10,0 %');
    expect(Num.percentage(10.123, { precision: 2 })).toStrictEqual('10.12%');
  });
});
