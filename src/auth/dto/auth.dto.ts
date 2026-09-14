import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CredentialsDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RegisterDto extends CredentialsDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;
}

export class RegisterPatientDto extends CredentialsDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsUUID()
  patientId!: string;
}
