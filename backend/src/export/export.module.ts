import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherLog, WeatherLogSchema } from '../weather/schemas/weather-log.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: WeatherLog.name, schema: WeatherLogSchema },
        ]),
    ],
    controllers: [ExportController],
    providers: [ExportService],
    exports: [ExportService],
})
export class ExportModule { }
