import { Contacts } from '../contacts/contacts';
import { DoubleZero } from '../core';
import { Lists } from '../lists/lists';
import { Tokens } from '../tokens/tokens';
import { Subscriptions } from './subscriptions';
import { assert, describe, expect, test, vi } from 'vitest';

describe('Subscriptions', () => {
  describe('createOptInToken', () => {
    test('generate a token with partial contact and list id', () => {
      const oo = {} as DoubleZero;

      const tokens = new Tokens(oo, '123');
      const subscriptions = new Subscriptions(
        oo,
        new Contacts(oo),
        new Lists(oo),
        tokens
      );
      const token = subscriptions.createOptInToken('1', {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'Man',
      });

      const payload = tokens.verify(token);
      expect(payload.id).toBe('1');
      expect(payload.contact.email).toBe('test@example.com');
      expect(payload.contact.first_name).toBe('Test');
    });
  });

  describe.skip('subscribeFromToken', () => {
    test('adds contact to list from token', async () => {
      const oo = {} as DoubleZero;
      const contacts = {
        getByEmail: () => ({ id: '123' }),
        create: () => ({
          id: '123',
        }),
      };
      const add_contact = vi.fn(() =>
        Promise.resolve({
          id: '123',
        })
      );
      const lists = {
        addContact: add_contact,
      };
      const tokens = new Tokens(oo, '123');
      const subscriptions = new Subscriptions(oo, contacts, lists, tokens);
      const token = subscriptions.createOptInToken('1', {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'Man',
        id: '123',
      });
      await subscriptions.subscribeFromToken(token);
      expect(add_contact).toHaveBeenCalled();
      expect(add_contact).toHaveBeenCalledWith('1', { contact_id: '123' });
    });
  });
});
