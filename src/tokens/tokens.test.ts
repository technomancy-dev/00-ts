import { DoubleZero } from '../core';
import { HALF_HOUR, ONE_HOUR } from '../utils';
import { Tokens } from './tokens';
import { expect, test, describe } from 'vitest';

describe('Tokens', () => {
  test('should sign and verify tokens correctly', () => {
    const tokens = new Tokens({} as DoubleZero, '123');
    const payload = { name: 'tom' };

    const token = tokens.sign(payload);
    const verified = tokens.verify(token);

    expect(verified.name).toBe(payload.name);
  });

  test('default expiration is half hour.', () => {
    const tokens = new Tokens({} as DoubleZero, '123');
    const payload = { test: true };

    const token = tokens.sign(payload);
    const verified = tokens.verify(token);

    const now = Math.floor(Date.now() / 1000);
    expect(verified.exp).toBeGreaterThan(now);
    expect(verified.exp).toBeLessThanOrEqual(now + HALF_HOUR);
  });
});
