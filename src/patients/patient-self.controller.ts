import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PatientAuthGuard } from '../auth/patient-auth.guard';
import type { PatientAuthenticatedRequest } from '../auth/patient-auth.guard';
import { Req } from '@nestjs/common';
import { DietsService } from '../diets/diets.service';
import { CreateProgressDto } from '../progress/dto/progress.dto';
import { ProgressService } from '../progress/progress.service';

@Controller('patient/me')
@UseGuards(PatientAuthGuard)
export class PatientSelfController {
  constructor(
    private readonly diets: DietsService,
    private readonly progress: ProgressService,
  ) {}

  @Get()
  me(@Req() request: PatientAuthenticatedRequest) {
    return request.patient;
  }

  @Get('diets')
  findDiets(@Req() request: PatientAuthenticatedRequest) {
    return this.diets.findForPatient(request.patient);
  }

  @Get('progress')
  findProgress(@Req() request: PatientAuthenticatedRequest) {
    return this.progress.findForPatient(request.patient);
  }

  @Post('progress')
  createProgress(
    @Body() body: CreateProgressDto,
    @Req() request: PatientAuthenticatedRequest,
  ) {
    return this.progress.createForPatient(body, request.patient);
  }
}
