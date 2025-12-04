import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherLogDocument = WeatherLog & Document;

@Schema({ timestamps: true })
export class WeatherLog {
  @Prop()
  source?: string;

  @Prop()
  obs_timestamp?: string;   // opcional

  @Prop({ required: true })
  timestamp: Date;

  @Prop()
  temperature: number;

  @Prop()
  windspeed: number;

  @Prop()
  humidity: number;

  @Prop()
  uvIndex: number;

  @Prop()
  precipitationChance: number;

  @Prop()
  heatIndex: number;

  @Prop()
  condition?: string;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
