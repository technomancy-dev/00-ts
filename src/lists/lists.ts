import { Contacts } from '../contacts/contacts';
import { DoubleZero } from '../core';
import { ListMeta } from '../types';
import { AddContactParams, List, ListContact, UpdateListParams } from './types';

export class Lists {
  constructor(private readonly doublezero: DoubleZero) {}

  async list(): Promise<{ data: List[]; meta: ListMeta }> {
    const data = await this.doublezero.get<{ data: List[]; meta: ListMeta }>(
      '/lists'
    );

    return data;
  }

  async get(id: string): Promise<List> {
    return await this.doublezero.get<{ data: List }>(`/lists/${id}`);
  }

  async update(id: string, params: UpdateListParams): Promise<List> {
    const data = await this.doublezero.patch<{ data: List }>(
      `/lists/${id}`,
      params
    );

    return data.data;
  }

  async delete(id: string): Promise<void> {
    return await this.doublezero.delete(`/lists/${id}`);
  }

  async create(params: { name: string; description: string }): Promise<List> {
    return await this.doublezero.post(`/lists/`, params);
  }

  async addContact(
    listId: string,
    params: AddContactParams
  ): Promise<ListContact> {
    return await this.doublezero.post<{ data: ListContact }>(
      `/lists/${listId}/contacts`,
      params
    );
  }

  async removeContact(
    listId: string,
    { contact_id }: { contact_id: string }
  ): Promise<void> {
    await this.doublezero.delete(`/lists/${listId}/contacts/${contact_id}`);
  }
}
