import { Body, Controller, Post, Get, Query, Param, Headers, BadRequestException, Res } from '@nestjs/common';
import { Response } from 'express';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { ConfigService } from '@nestjs/config';

@Controller('api/weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly config: ConfigService,
  ) { }

  @Post('logs')
  async create(
    @Body() dto: CreateWeatherDto,
    @Headers('x-worker-secret') secret?: string,
  ) {
    const expected = this.config.get<string>('WORKER_SECRET');

    if (!expected || expected.length === 0) {
      throw new BadRequestException('WORKER_SECRET not configured');
    }

    if (!secret || secret !== expected) {
      throw new BadRequestException('Invalid worker secret');
    }

    const saved = await this.weatherService.createFromDto(dto);
    return { success: true, id: saved._id };
  }

  @Get('logs')
  findAll(
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.weatherService.findAll({ start, end });
  }

  @Get('logs/latest')
  findLatest() {
    return this.weatherService.findLatest();
  }

  @Get('current')
  getCurrentWeather() {
    return this.weatherService.getCurrent();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weatherService.findOne(id);
  }

  @Get("export/csv")
  async exportCSV(
    @Query("start") start: string,
    @Query("end") end: string,
    @Res() res: Response
  ) {
    const csv = await this.weatherService.exportCSV({ start, end });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=weather.csv");

    res.send(csv);
  }

  @Get("export/xlsx")
  async exportXLSX(
    @Query("start") start: string,
    @Query("end") end: string,
    @Res() res: Response
  ) {
    const buffer = await this.weatherService.exportXLSX({ start, end });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=weather.xlsx"
    );

    res.send(buffer);
  }
}
