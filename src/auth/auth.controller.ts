import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './auth.guard';
import {
  RegisterDto,
  CredentialsDto,
  RegisterPatientDto,
} from './dto/auth.dto';
import type { AuthenticatedRequest } from './auth.guard';
import type { User } from '@supabase/supabase-js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.auth.register(body.email, body.password, body.nombre);
  }

  @Post('login')
  login(@Body() body: CredentialsDto) {
    return this.auth.login(body.email, body.password);
  }

  @Post('register-patient')
  @UseGuards(SupabaseAuthGuard)
  registerPatient(
    @Body() body: RegisterPatientDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.auth.registerPatient(
      body.email,
      body.password,
      body.nombre,
      body.patientId,
      request.nutritionist,
    );
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  me(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      userMetadata: user.user_metadata,
    };
  }
}
