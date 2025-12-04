import { Controller, Post, Body } from "@nestjs/common";
import { DeepSeekService } from "./deepseek.service";

@Controller("ai")
export class DeepSeekController {
    constructor(private readonly deepSeekService: DeepSeekService) { }

    @Post("weather-insights")
    async generateInsights(@Body("data") data: any[]) {
        if (!Array.isArray(data) || data.length === 0) {
            return { error: "Envie um array com dados meteorológicos." };
        }

        const insights = await this.deepSeekService.generateWeatherInsights(data);
        return { insights };
    }
}
