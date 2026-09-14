import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import type { WebSocketLikeConstructor } from '@supabase/realtime-js';
import WebSocket from 'ws';

@Injectable()
export class SupabaseService {
  private readonly client?: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_KEY;

    if (url && key) {
      this.client = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
        realtime: {
          transport: WebSocket as unknown as WebSocketLikeConstructor,
        },
      });
    }
  }

  isConfigured(): boolean {
    return Boolean(this.client);
  }

  async signUp(
    email: string,
    password: string,
    nombre?: string,
  ): Promise<{ user: User | null; session: unknown }> {
    const client = this.requireClient();
    const { data, error } = await client.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: nombre ? { data: { nombre } } : undefined,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { user: data.user, session: data.session };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ user: User | null; session: unknown }> {
    const client = this.requireClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return { user: data.user, session: data.session };
  }

  async getUser(accessToken: string): Promise<User> {
    const client = this.requireClient();
    const { data, error } = await client.auth.getUser(accessToken);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired Supabase token');
    }

    return data.user;
  }

  private requireClient(): SupabaseClient {
    if (!this.client) {
      throw new ServiceUnavailableException(
        'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.',
      );
    }

    return this.client;
  }
}
