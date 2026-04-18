import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsNumber()
  price: number;

  @IsNumber()
  durationMinutes: number;
}
