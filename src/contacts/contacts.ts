import { DoubleZero } from '../core';
import { ListMeta } from '../types';
import { Contact, UpdateContactParams } from './types';

export class Contacts {
  constructor(private readonly doublezero: DoubleZero) {}

  async list(): Promise<{ data: Contact[]; meta: ListMeta }> {
    return await this.doublezero.get<{ data: Contact[]; meta: ListMeta }>(
      '/contacts'
    );
  }

  async get(id: string): Promise<Contact> {
    return await this.doublezero.get<{ data: Contact }>(`/contacts/${id}`);
  }

  async getByEmail(email: string): Promise<Contact> {
    return await this.doublezero.get<{ data: Contact }>(
      `/contacts/email/${email}`
    );
  }

  async create(params: UpdateContactParams): Promise<Contact> {
    return await this.doublezero.post<{ data: Contact }>(`/contacts`, params);
  }

  async update(id: string, params: UpdateContactParams): Promise<Contact> {
    return await this.doublezero.patch<{ data: Contact }>(
      `/contacts/${id}`,
      params
    );
  }

  async delete(id: string): Promise<void> {
    return await this.doublezero.delete(`/contacts/${id}`);
  }
}
