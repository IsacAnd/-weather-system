import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeepSeekService {
    private readonly apiKey: string;
    private readonly model: string;
    private readonly apiUrl: string;

    constructor(private readonly config: ConfigService) {
        this.apiKey = this.config.get<string>('DS_API_KEY')!;
        this.model = this.config.get<string>('DS_MODEL')!;
        this.apiUrl = this.config.get<string>('DS_API_URL')!;
    }

    async generateWeatherInsights(weatherData: any[]): Promise<string> {
        if (!this.apiKey) {
            throw new HttpException(
                'DS_API_KEY não configurada no .env',
                500,
            );
        }

        const formattedData = JSON.stringify(weatherData.slice(0, 100), null, 2);

        const payload = {
            model: this.model,
            messages: [
                {
                    role: "system",
                    content:
                        "Analise a lista de 100 dados meteorológicos enviados e gere APENAS UM insight curto e direto(no máximo 12 palavras). Estilo simples e útil, como: UV muito alto agora, use protetor solar! Chuva provável à tarde. Sensação térmica elevada nas próximas horas. Não explique nada. Não formate. Não use markdown. Apenas uma frase.",
                },
                {
                    role: "user",
                    content: `Aqui estão os dados meteorológicos (máx. 100 registros):\n\n${formattedData}\n\n`,
                },
            ],
            temperature: 0.3,
            max_output_tokens: 600,
        };

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new HttpException(
                    `Erro da API DeepSeek: ${err}`,
                    response.status,
                );
            }

            const data = await response.json();

            return (
                data?.choices?.[0]?.message?.content ??
                "Não foi possível gerar insights."
            );
        } catch (error: any) {
            throw new HttpException(
                `Erro ao chamar o modelo DeepSeek: ${error.message}`,
                500,
            );
        }
    }
}
