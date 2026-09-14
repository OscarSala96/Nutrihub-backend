import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, jest } from '@jest/globals';
import { SupabaseAuthGuard } from './auth.guard';

describe('SupabaseAuthGuard', () => {
  it('rejects requests without a bearer token', async () => {
    const guard = new SupabaseAuthGuard({} as never, {} as never);
    const request = { headers: {} };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('validates the token and attaches the Supabase user and profile', async () => {
    const user = { id: 'user-id', email: 'nutri@example.com' };
    const nutritionist = { idNutri: 'nutritionist-id' };
    const supabase = { getUser: jest.fn().mockResolvedValue(user) };
    const auth = {
      ensureNutritionist: jest.fn().mockResolvedValue(nutritionist),
    };
    const guard = new SupabaseAuthGuard(supabase as never, auth as never);
    const request = { headers: { authorization: 'Bearer access-token' } } as {
      headers: { authorization: string };
      user?: unknown;
      nutritionist?: unknown;
    };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(supabase.getUser).toHaveBeenCalledWith('access-token');
    expect(auth.ensureNutritionist).toHaveBeenCalledWith(user);
    expect(request.user).toBe(user);
    expect(request.nutritionist).toBe(nutritionist);
  });
});
