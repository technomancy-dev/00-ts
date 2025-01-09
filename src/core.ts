import { version } from '../package.json';
import { Contacts } from './contacts/contacts';
import { Emails } from './emails/emails';
import { DoubleZeroError } from './error';
import { Lists } from './lists/lists';
import { Subscriptions } from './subscriptions/subscriptions';
import { Tokens } from './tokens/tokens';
import { GetOptions, PatchOptions, PostOptions, PutOptions } from './types';

type ApiResponse<T> = {
  data: T | null;
  error: DoubleZeroError | null;
};

const defaultUserAgent = `00-node:${version}`;
const userAgent =
  typeof process !== 'undefined' && process.env
    ? process.env.DOUBLEZERO_USER_AGENT || defaultUserAgent
    : defaultUserAgent;

export class DoubleZero {
  private readonly headers: Headers;

  readonly emails = new Emails(this);
  readonly contacts = new Contacts(this);
  readonly lists = new Lists(this);
  readonly tokens: Tokens | null = null;
  readonly subscriptions: Subscriptions | null = null;

  constructor(
    readonly params: { baseUrl: string; token?: string; secretKey?: string }
  ) {
    if (this.params.secretKey) {
      this.tokens = new Tokens(this, this.params.secretKey);
      this.subscriptions = new Subscriptions(
        this,
        this.contacts,
        this.lists,
        this.tokens as Tokens
      );
    }
    if (!params.token) {
      if (typeof process !== 'undefined' && process.env) {
        this.params.token = process.env.DOUBLEZERO_TOKEN;
      }
    }

    if (!this.params.token) {
      return {
        data: null,
        error: new DoubleZeroError(
          'Missing DoubleZero API token. Pass it to the constructor `new DoubleZero({ baseUrl: "https://example.com", token: "your_api_token" })`'
        ),
      };
    }

    this.headers = new Headers({
      Authorization: `Bearer ${this.params.token}`,
      'User-Agent': userAgent,
      'Content-Type': 'application/json',
    });
  }

  async fetchRequest<T>(path: string, options = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(
        `${this.params.baseUrl}/api${path}`,
        options
      );

      if (response.status === 204) {
        return { data: { success: 'ok' } as T, error: null };
      }

      if (!response.ok) {
        const data = await response.json();
        return {
          data: null,
          error: new DoubleZeroError(
            `DoubleZero API error: ${response.statusText}: ${JSON.stringify(
              data.error
            )}`
          ),
        };
      }

      if (response.headers.get('content-length') === '0') {
        return { data: {} as T, error: null };
      }

      const data = await response.json();

      if (data.error) {
        return { data: null, error: data.error };
      }

      return { data: data.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: new DoubleZeroError(
          error instanceof Error ? error.message : 'Unknown error occurred'
        ),
      };
    }
  }

  async post<T>(
    path: string,
    payload?: unknown,
    options: PostOptions = {}
  ): Promise<ApiResponse<T>> {
    const requestOptions = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
      ...options,
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async get<T>(
    path: string,
    options: GetOptions = {}
  ): Promise<ApiResponse<T>> {
    const requestOptions = {
      method: 'GET',
      headers: this.headers,
      ...options,
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async put<T>(
    path: string,
    payload: any,
    options: PutOptions = {}
  ): Promise<ApiResponse<T>> {
    const requestOptions = {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(payload),
      ...options,
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async patch<T>(
    path: string,
    payload: any,
    options: PatchOptions = {}
  ): Promise<ApiResponse<T>> {
    const requestOptions = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(payload),
      ...options,
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async delete<T>(path: string, query?: unknown): Promise<ApiResponse<T>> {
    const requestOptions = {
      method: 'DELETE',
      headers: this.headers,
      body: JSON.stringify(query),
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }
}
