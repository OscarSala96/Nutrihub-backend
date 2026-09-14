import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from './supabase.service';

export type PatientAuthenticatedRequest = Request & {
  user: import('@supabase/supabase-js').User;
  patient: import('@prisma/client').PACIENTE;
};

@Injectable()
export class PatientAuthGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<PatientAuthenticatedRequest>();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token is required');
    }

    const user = await this.supabase.getUser(header.slice(7).trim());
    const patient = await this.prisma.pACIENTE.findUnique({
      where: { authUserId: user.id },
    });
    if (!patient) {
      throw new UnauthorizedException('Authenticated user is not a patient');
    }

    request.user = user;
    request.patient = patient;
    return true;
  }
}
