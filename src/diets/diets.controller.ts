import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { CreateDietDto } from './dto/diet.dto';
import { DietsService } from './diets.service';

@Controller('patients/:patientId/diets')
@UseGuards(SupabaseAuthGuard)
export class DietsController {
  constructor(private readonly diets: DietsService) {}

  @Post()
  create(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() body: CreateDietDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.diets.create(patientId, body, request.nutritionist);
  }

  @Get()
  findAll(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.diets.findAll(patientId, request.nutritionist);
  }
}
