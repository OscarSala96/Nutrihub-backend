import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientSelfController } from './patient-self.controller';
import { DietsService } from '../diets/diets.service';
import { ProgressService } from '../progress/progress.service';

@Module({
  imports: [AuthModule],
  controllers: [PatientsController, PatientSelfController],
  providers: [PatientsService, DietsService, ProgressService],
})
export class PatientsModule {}
