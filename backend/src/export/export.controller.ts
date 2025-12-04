import { Controller, Get, Header, Res } from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';

@Controller('export')
export class ExportController {
    constructor(private readonly exportService: ExportService) { }

    /** DOWNLOAD CSV */
    @Get('csv')
    @Header('Content-Type', 'text/csv')
    @Header('Content-Disposition', 'attachment; filename="weather_logs.csv"')
    async downloadCsv(@Res() res: Response) {
        const csv = await this.exportService.exportCsv();
        res.send(csv);
    }

    /** DOWNLOAD XLSX */
    @Get('xlsx')
    async downloadXlsx(@Res() res: Response) {
        const buffer = await this.exportService.exportXlsx();

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );

        res.setHeader(
            'Content-Disposition',
            'attachment; filename="weather_logs.xlsx"',
        );

        res.end(buffer);
    }
}
