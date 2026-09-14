import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './auth.guard';
import { PatientAuthGuard } from './patient-auth.guard';
import { SupabaseService } from './supabase.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SupabaseService,
    SupabaseAuthGuard,
    PatientAuthGuard,
  ],
  exports: [AuthService, SupabaseAuthGuard, PatientAuthGuard, SupabaseService],
})
export class AuthModule {}
