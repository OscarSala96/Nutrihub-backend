import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Req } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
@UseGuards(SupabaseAuthGuard)
export class PatientsController {
  constructor(private readonly patients: PatientsService) {}

  @Post()
  create(@Body() body: CreatePatientDto, @Req() request: AuthenticatedRequest) {
    return this.patients.create(body, request.nutritionist);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.patients.findAll(request.nutritionist);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.patients.findOne(id, request.nutritionist);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdatePatientDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.patients.update(id, body, request.nutritionist);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.patients.remove(id, request.nutritionist);
  }
}
