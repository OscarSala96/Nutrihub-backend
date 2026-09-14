import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NUTRICIONISTA } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../auth/supabase.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  findAll(nutritionist: NUTRICIONISTA) {
    return this.prisma.pACIENTE.findMany({
      where: { idNutri: nutritionist.idNutri },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(idPaciente: string, nutritionist: NUTRICIONISTA) {
    const patient = await this.prisma.pACIENTE.findFirst({
      where: { idPaciente, idNutri: nutritionist.idNutri },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async create(dto: CreatePatientDto, nutritionist: NUTRICIONISTA) {
    const existing = await this.prisma.pACIENTE.findFirst({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('A patient with this email already exists');
    }

    const auth = await this.supabase.signUp(
      dto.email,
      dto.password,
      dto.nombre,
    );
    if (!auth.user) {
      throw new ConflictException(
        'Supabase did not return a user for the patient account',
      );
    }

    return this.prisma.pACIENTE.create({
      data: {
        idPaciente: auth.user.id,
        authUserId: auth.user.id,
        idNutri: nutritionist.idNutri,
        nombre: dto.nombre,
        edad: dto.edad,
        pesoInicial: dto.pesoInicial,
        email: dto.email,
        telefono: dto.telefono,
      },
    });
  }

  async update(
    idPaciente: string,
    dto: UpdatePatientDto,
    nutritionist: NUTRICIONISTA,
  ) {
    await this.findOne(idPaciente, nutritionist);
    return this.prisma.pACIENTE.update({
      where: { idPaciente },
      data: dto,
    });
  }

  async remove(idPaciente: string, nutritionist: NUTRICIONISTA) {
    await this.findOne(idPaciente, nutritionist);
    await this.prisma.pACIENTE.delete({ where: { idPaciente } });
    return { deleted: true };
  }
}
