import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CreateDietDto {
  @IsDateString()
  fechaInicio!: string;

  @IsDateString()
  fechaFin!: string;

  @IsObject()
  @IsNotEmpty()
  descripcion!: Record<string, unknown>;
}

export class DietQueryDto {
  @IsOptional()
  @Type(() => Boolean)
  activo?: boolean;
}
