import { Num } from '../number';

jest.mock('../../config/service');

describe('Numbers Helper', () => {
  beforeEach(async () => {});

  it('should abbrevate with en locale to 1 decimal point precision', () => {
    const number = 12345;
    expect(Num.abbreviate(number)).toBe('12.3K');
  });

  it('should abbrevate with en locale to 3 decimal precision', () => {
    const number = 12345;
    const options = { precision: 3, locale: 'en' };
    expect(Num.abbreviate(number, options)).toBe('12.345K');
  });

  it('should abbrevate with en-IN locale to 3 decimal precision', () => {
    const number = 12345;
    const options = { precision: 3, locale: 'en-IN' };
    expect(Num.abbreviate(number, options)).toBe('12.345K');
  });

  it('should return number itself', () => {
    const number = 12345;
    const min = 12300;
    const max = 12400;
    expect(Num.clamp(number, min, max)).toBe(number);
  });

  it('should return minimum number', () => {
    const number = 12345;
    const min = 12350;
    const max = 12400;
    expect(Num.clamp(number, min, max)).toBe(min);
  });

  it('should return maximum number', () => {
    const number = 12345;
    const min = 12300;
    const max = 12340;
    expect(Num.clamp(number, min, max)).toBe(max);
  });

  it('should return number in currency style in INR', () => {
    const number = 12345;
    const options = { currency: 'INR', locale: 'en' };
    expect(Num.currency(number, options)).toBe('₹12,345.00');
  });

  it('should return number in currency style in USD', () => {
    const number = 12345;
    const options = { currency: 'USD', locale: 'en' };
    expect(Num.currency(number, options)).toBe('$12,345.00');
  });

  it('should return number in file size format', () => {
    const number = 12345;
    expect(Num.fileSize(number)).toBe('12.3KB');
  });

  it('should return number in file size format with precision 3', () => {
    const number = 123456789;
    const options = { precision: 3 };
    expect(Num.fileSize(number, options)).toBe('123.457MB');
  });

  it('should return number in humanize form with precision 1', () => {
    const number = 12345;
    const options = { precision: 1, locale: 'en' };
    expect(Num.forHumans(number, options)).toBe('12.3 thousand');
  });

  it('should return number in humanize form with precision 3', () => {
    const number = 123456789;
    const options = { precision: 3, locale: 'en' };
    expect(Num.forHumans(number, options)).toBe('123.457 million');
  });

  it('should return number in number system format with precision 1(default)', () => {
    const number = 12345.78;
    const options = { locale: 'en' };
    expect(Num.format(number, options)).toBe('12,345.8');
  });

  it('should return number in percents when passed as decimal portion with precision 1(default)', () => {
    const number = 17.8;
    const options = { locale: 'en' };
    expect(Num.percentage(number, options)).toBe('17.8%');
  });

  it('should return number in ordinal format', () => {
    const number = 231;
    expect(Num.ordinal(number)).toBe('231st');
  });

  it('should return number in ordinal format', () => {
    const number = 12345;
    expect(Num.ordinal(number)).toBe('12345th');
  });

  it('should return number in english words', () => {
    const number = 12345;
    expect(Num.spell(number)).toBe(
      'twelve thousand three hundred and forty five only',
    );
  });

  it('should return false', () => {
    const number = '12345';
    expect(Num.isInteger(number)).toBe(false);
  });
  it('should return true', () => {
    const number = 12345;
    expect(Num.isInteger(number)).toBe(true);
  });
});
