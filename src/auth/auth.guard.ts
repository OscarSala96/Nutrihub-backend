import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

export type AuthenticatedRequest = Request & {
  user: import('@supabase/supabase-js').User;
  nutritionist: import('@prisma/client').NUTRICIONISTA;
};

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token is required');
    }

    const user = await this.supabase.getUser(header.slice(7).trim());
    request.user = user;
    request.nutritionist = await this.auth.ensureNutritionist(user);
    return true;
  }
}
