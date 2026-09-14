import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateProgressDto {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  peso!: number;

  @IsOptional()
  @IsObject()
  observaciones?: Record<string, unknown>;
}
