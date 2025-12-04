import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from '../weather/schemas/weather-log.schema';
import * as XLSX from 'xlsx';

@Injectable()
export class ExportService {
    constructor(
        @InjectModel(WeatherLog.name)
        private readonly logModel: Model<WeatherLogDocument>,
    ) { }

    async exportCsv() {
        const logs = await this.logModel.find().lean();

        const parser = new Parser();
        const csv = parser.parse(logs);

        return csv;
    }

    async exportXlsx() {
        const logs = await this.logModel.find().lean();

        const worksheet = XLSX.utils.json_to_sheet(logs);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');

        const xlsxBuffer = XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx',
        });

        return xlsxBuffer;
    }
}
