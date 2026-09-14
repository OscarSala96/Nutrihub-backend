import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, NUTRICIONISTA } from '@prisma/client';
import { User } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from './supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  register(email: string, password: string, nombre?: string) {
    return this.supabase
      .signUp(email, password, nombre)
      .then(async (result) => {
        if (result.user) {
          await this.ensureNutritionist(result.user, nombre);
        }
        return result;
      });
  }

  login(email: string, password: string) {
    return this.supabase.signIn(email, password).then(async (result) => {
      if (result.user) {
        await this.ensureNutritionist(result.user);
      }
      return result;
    });
  }

  async ensureNutritionist(
    user: User,
    nombre?: string,
  ): Promise<NUTRICIONISTA> {
    if (!user.email) {
      throw new InternalServerErrorException(
        'Supabase user does not have an email address',
      );
    }

    const existingByAuthId = await this.prisma.nUTRICIONISTA.findUnique({
      where: { authUserId: user.id },
    });
    if (existingByAuthId) {
      return existingByAuthId;
    }

    const existingByEmail = await this.prisma.nUTRICIONISTA.findUnique({
      where: { email: user.email },
    });
    if (existingByEmail) {
      if (
        existingByEmail.authUserId &&
        existingByEmail.authUserId !== user.id
      ) {
        throw new ForbiddenException(
          'This nutritionist profile is linked to another Supabase user',
        );
      }
      return this.prisma.nUTRICIONISTA.update({
        where: { idNutri: existingByEmail.idNutri },
        data: { authUserId: user.id },
      });
    }

    try {
      return await this.prisma.nUTRICIONISTA.create({
        data: {
          authUserId: user.id,
          email: user.email,
          nombre:
            nombre ??
            (typeof user.user_metadata?.nombre === 'string'
              ? user.user_metadata.nombre
              : user.email.split('@')[0]),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const nutritionist = await this.prisma.nUTRICIONISTA.findUnique({
          where: { authUserId: user.id },
        });
        if (nutritionist) {
          return nutritionist;
        }
      }
      throw error;
    }
  }

  async registerPatient(
    email: string,
    password: string,
    nombre: string,
    patientId: string,
    nutritionist: NUTRICIONISTA,
  ) {
    const patient = await this.prisma.pACIENTE.findFirst({
      where: { idPaciente: patientId, idNutri: nutritionist.idNutri },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    if (patient.authUserId) {
      throw new ForbiddenException('Patient already has an account');
    }

    const result = await this.supabase.signUp(email, password, nombre);
    if (!result.user) {
      return result;
    }

    await this.prisma.pACIENTE.update({
      where: { idPaciente: patient.idPaciente },
      data: { authUserId: result.user.id, email, nombre },
    });
    return result;
  }
}
