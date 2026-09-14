import { Injectable, NotFoundException } from '@nestjs/common';
import { PACIENTE, Prisma, NUTRICIONISTA } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressDto } from './dto/progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertPatient(idPaciente: string, nutritionist: NUTRICIONISTA) {
    const patient = await this.prisma.pACIENTE.findFirst({
      where: { idPaciente, idNutri: nutritionist.idNutri },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
  }

  async create(
    idPaciente: string,
    dto: CreateProgressDto,
    nutritionist: NUTRICIONISTA,
  ) {
    await this.assertPatient(idPaciente, nutritionist);
    return this.prisma.pROGRESS_LOG.create({
      data: {
        idPaciente,
        fecha: dto.fecha ? new Date(dto.fecha) : new Date(),
        peso: dto.peso,
        observaciones: (dto.observaciones ?? {}) as Prisma.InputJsonValue,
      },
    });
  }

  async findAll(idPaciente: string, nutritionist: NUTRICIONISTA) {
    await this.assertPatient(idPaciente, nutritionist);
    return this.prisma.pROGRESS_LOG.findMany({
      where: { idPaciente },
      orderBy: { fecha: 'desc' },
    });
  }

  createForPatient(dto: CreateProgressDto, patient: PACIENTE) {
    return this.prisma.pROGRESS_LOG.create({
      data: {
        idPaciente: patient.idPaciente,
        fecha: dto.fecha ? new Date(dto.fecha) : new Date(),
        peso: dto.peso,
        observaciones: (dto.observaciones ?? {}) as Prisma.InputJsonValue,
      },
    });
  }

  findForPatient(patient: PACIENTE) {
    return this.prisma.pROGRESS_LOG.findMany({
      where: { idPaciente: patient.idPaciente },
      orderBy: { fecha: 'desc' },
    });
  }
}
