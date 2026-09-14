import { Injectable, NotFoundException } from '@nestjs/common';
import { PACIENTE, Prisma, NUTRICIONISTA } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDietDto } from './dto/diet.dto';

@Injectable()
export class DietsService {
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
    dto: CreateDietDto,
    nutritionist: NUTRICIONISTA,
  ) {
    await this.assertPatient(idPaciente, nutritionist);
    return this.prisma.dIETA.create({
      data: {
        idPaciente,
        fechaInicio: new Date(dto.fechaInicio),
        fechaFin: new Date(dto.fechaFin),
        descripcion: dto.descripcion as Prisma.InputJsonValue,
      },
    });
  }

  async findAll(idPaciente: string, nutritionist: NUTRICIONISTA) {
    await this.assertPatient(idPaciente, nutritionist);
    return this.prisma.dIETA.findMany({
      where: { idPaciente },
      orderBy: { fechaInicio: 'desc' },
    });
  }

  findForPatient(patient: PACIENTE) {
    return this.prisma.dIETA.findMany({
      where: { idPaciente: patient.idPaciente },
      orderBy: { fechaInicio: 'desc' },
    });
  }
}
