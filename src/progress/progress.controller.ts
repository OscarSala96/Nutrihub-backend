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
import { CreateProgressDto } from './dto/progress.dto';
import { ProgressService } from './progress.service';

@Controller('patients/:patientId/progress')
@UseGuards(SupabaseAuthGuard)
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Post()
  create(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() body: CreateProgressDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.progress.create(patientId, body, request.nutritionist);
  }

  @Get()
  findAll(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.progress.findAll(patientId, request.nutritionist);
  }
}
