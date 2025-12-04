// import { IsOptional, IsNumber, IsObject, IsString, IsISO8601 } from 'class-validator';
// import { Type } from 'class-transformer';

// export class CreateWeatherDto {
//   @IsString()
//   source: string;

//   @IsOptional()
//   @IsObject()
//   location?: Record<string, any>;

//   @IsString()
//   @IsISO8601()
//   timestamp: string;

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   temperature_c?: number;

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   humidity_pct?: number;

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   wind_speed_ms?: number;

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   precip_prob_pct?: number;

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   weather_code?: number;

//   @IsOptional()
//   @IsObject()
//   raw?: any;
// }

import { IsOptional, IsNumber, IsString, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWeatherDto {
  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsISO8601()
  obs_timestamp?: string

  @IsString()
  @IsISO8601()
  timestamp: string;

  @IsNumber()
  @Type(() => Number)
  temperature: number;

  @IsNumber()
  @Type(() => Number)
  windspeed: number;

  @IsNumber()
  @Type(() => Number)
  humidity: number;

  @IsNumber()
  @Type(() => Number)
  uvIndex: number;

  @IsNumber()
  @Type(() => Number)
  precipitationChance: number;

  @IsNumber()
  @Type(() => Number)
  heatIndex: number;

  @IsOptional()
  @IsString()
  condition?: string;
}
