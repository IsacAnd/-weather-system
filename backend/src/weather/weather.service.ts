import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from './schemas/weather-log.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';
import * as XLSX from "xlsx";
import Papa from "papaparse";

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @InjectModel(WeatherLog.name) private weatherModel: Model<WeatherLogDocument>,
  ) { }

  async createFromDto(dto: CreateWeatherDto) {
    const timestamp = new Date(dto.timestamp);

    const doc = new this.weatherModel({
      source: dto.source || 'unknown',
      obs_timestamp: dto.obs_timestamp || null,
      timestamp,
      temperature: dto.temperature,
      windspeed: dto.windspeed,
      humidity: dto.humidity,
      uvIndex: dto.uvIndex,
      precipitationChance: dto.precipitationChance,
      heatIndex: dto.heatIndex,
      condition: dto.condition,
    });

    const saved = await doc.save();
    this.logger.log(`Saved weather log ${saved._id}`);
    return saved;
  }

  async findAll(filter?: { start?: string; end?: string }) {
    const query: any = {};

    if (filter?.start) {
      query.timestamp = { $gte: new Date(filter.start) };
    }
    if (filter?.end) {
      query.timestamp = {
        ...(query.timestamp || {}),
        $lte: new Date(filter.end),
      };
    }

    return this.weatherModel
      .find(query)
      .sort({ timestamp: -1 })
      .lean()
      .exec();
  }

  async findLatest() {
    return this.weatherModel
      .findOne()
      .sort({ timestamp: -1 })
      .lean()
      .exec();
  }

  async findOne(id: string) {
    return this.weatherModel.findById(id).lean().exec();
  }

  async getCurrent() {
    const latest = await this.findLatest();

    if (!latest) {
      throw new Error('Nenhum dado de clima encontrado');
    }

    return {
      temperature: latest.temperature,
      humidity: latest.humidity,
      windSpeed: latest.windspeed,
      uvIndex: latest.uvIndex,
      precipitationChance: latest.precipitationChance,
      heatIndex: latest.heatIndex,
      timestamp: latest.timestamp,
      source: latest.source,
      condition: latest.condition,
    };
  }

  async exportCSV(filter?: { start?: string; end?: string }): Promise<string> {
    const data = await this.findAll(filter);

    const csv = Papa.unparse(
      data.map((item) => ({
        timestamp: item.timestamp,
        temperature: item.temperature,
        windspeed: item.windspeed,
        humidity: item.humidity,
        uvIndex: item.uvIndex,
        precipitationChance: item.precipitationChance,
        heatIndex: item.heatIndex,
        condition: item.condition,
        source: item.source,
      }))
    );

    return csv;
  }

  async exportXLSX(filter?: { start?: string; end?: string }): Promise<Buffer> {
    const data = await this.findAll(filter);

    const worksheetData = data.map((item) => ({
      Timestamp: item.timestamp,
      Temperature: item.temperature,
      Windspeed: item.windspeed,
      Humidity: item.humidity,
      UVIndex: item.uvIndex,
      PrecipitationChance: item.precipitationChance,
      HeatIndex: item.heatIndex,
      Condition: item.condition,
      Source: item.source,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "WeatherData");

    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  }

}
