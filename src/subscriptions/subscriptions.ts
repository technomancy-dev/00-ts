import { DoubleZero } from '../core';
import { Contacts } from '../contacts/contacts';
import { Lists } from '../lists/lists';
import { Tokens } from '../tokens/tokens';
import { Contact } from '../contacts/types';

export class Subscriptions {
  constructor(
    private readonly doublezero: DoubleZero,
    private readonly contacts: Contacts,
    private readonly lists: Lists,
    private readonly tokens: Tokens
  ) {}

  createOptInToken(
    id: string,
    contact: Pick<Contact, 'first_name' | 'email'> & Partial<Contact>
  ) {
    return this.tokens.sign({ id, contact });
  }

  async subscribeFromToken(token: any) {
    const payload = this.tokens.verify(token);

    let { data: contact } = await this.contacts.getByEmail(
      payload.contact.email
    );
    if (!contact) {
      const { data } = await this.contacts.create(payload.contact);
      contact = data;
    }
    return this.lists.addContact(payload.id, { contact_id: contact.id });
  }
}
