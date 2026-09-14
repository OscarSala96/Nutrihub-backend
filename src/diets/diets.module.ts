import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DietsController } from './diets.controller';
import { DietsService } from './diets.service';

@Module({
  imports: [AuthModule],
  controllers: [DietsController],
  providers: [DietsService],
})
export class DietsModule {}
