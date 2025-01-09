import { DoubleZero } from '../core';
import jwt from 'jsonwebtoken';
import { HALF_HOUR } from '../utils';

export class Tokens {
  #secretKey: string;

  constructor(private readonly doublezero: DoubleZero, secretKey: string) {
    this.#secretKey = secretKey;
  }

  sign(payload: any, expiration?: number) {
    return jwt.sign(
      {
        ...payload,
        exp: expiration || Math.floor(Date.now() / 1000) + HALF_HOUR,
      },
      this.#secretKey
    );
  }

  verify(token: string): any | null {
    return jwt.verify(token, this.#secretKey);
  }
}
