import { Card } from "./ui/card";
import { Sun, Cloud, Droplet, CloudFog, CloudLightning } from "lucide-react";
import type { JSX } from "react/jsx-dev-runtime";

type WeatherCondition =
    | "Ensolarado"
    | "Nublado"
    | "Chuvoso"
    | "Neblina"
    | "Tempestade";

interface OverviewSectionProps {
    weatherData: any;
    loadingWeather: boolean;
    insight: string | null;
    loadingInsight: boolean;
    insightError: boolean;
}

export default function OverviewSection({
    weatherData,
    loadingWeather,
    insight,
    loadingInsight,
    insightError,
}: OverviewSectionProps) {
    const conditionIcons: Record<WeatherCondition, JSX.Element> = {
        Ensolarado: <Sun className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_15px_rgba(255,230,0,0.5)]" />,
        Nublado: <Cloud className="w-20 h-20 text-gray-300 drop-shadow-[0_0_12px_rgba(200,200,200,0.4)]" />,
        Chuvoso: <Droplet className="w-20 h-20 text-blue-400 drop-shadow-[0_0_15px_rgba(50,130,255,0.5)]" />,
        Neblina: <CloudFog className="w-20 h-20 text-gray-400 drop-shadow-[0_0_15px_rgba(180,180,180,0.5)]" />,
        Tempestade: <CloudLightning className="w-20 h-20 text-purple-500 drop-shadow-[0_0_18px_rgba(180,0,255,0.6)]" />,
    };

    if (loadingWeather) {
        return <p className="text-center text-gray-300">Carregando...</p>;
    }

    if (!weatherData) {
        return <p className="text-center text-red-400">Erro ao carregar dados.</p>;
    }

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* 🔥 CARD PRINCIPAL */}
            <Card className="lg:col-span-2 bg-[#161b22] text-white rounded-3xl p-8 shadow-xl border border-white/10">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-purple-400 px-3 py-1 rounded-full bg-purple-400/10 text-sm">
                            Ceará, Brasil
                        </span>

                        <h2 className="text-5xl font-bold mt-6">
                            {weatherData.temperature}°C
                        </h2>

                        <p className="text-gray-400 text-lg mt-1">
                            {new Date().toLocaleDateString("pt-BR", {
                                weekday: "long",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>

                        <p className="text-3xl font-semibold mt-6">
                            {weatherData.condition}
                        </p>

                        <p className="text-gray-400">
                            Sensação térmica: {weatherData.heatIndex}°
                        </p>
                    </div>

                    <div className="drop-shadow-xl">
                        {conditionIcons[weatherData.condition as WeatherCondition]}
                    </div>
                </div>

                {/* 🤖 INSIGHT */}
                <div className="mt-10">
                    {loadingInsight && (
                        <div className="animate-pulse text-gray-400 text-lg bg-white/5 p-3 rounded-2xl border border-white/10 w-fit">
                            Analisando clima...
                        </div>
                    )}

                    {insightError && (
                        <div className="text-red-400 bg-red-400/10 p-3 rounded-2xl border border-red-400/20 w-fit">
                            Não foi possível gerar o insight.
                        </div>
                    )}

                    {insight && !loadingInsight && !insightError && (
                        <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl shadow-lg w-fit backdrop-blur-sm">
                            <Sun className="w-6 h-6 text-purple-300 animate-pulse" />
                            <p className="text-purple-200 text-lg font-medium">
                                {insight}
                            </p>
                        </div>
                    )}
                </div>

                {/* 🗺️ MAPA */}
                <div className="mt-10 w-full">
                    <iframe
                        width="100%"
                        height="350"
                        className="rounded-3xl border border-white/10 shadow-lg"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15926.801842055118!2d-38.5433501!3d-3.7327141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c7491cf8b4bb7f%3A0x75b4d8ebaffe01dd!2sFortaleza%2C%20CE!5e0!3m2!1spt-BR!2sbr!4v1733252170000!5m2!1spt-BR!2sbr"
                    />
                </div>
            </Card>

            {/* 📊 MÉTRICAS LATERAIS */}
            <div className="grid grid-cols-1 gap-6">
                {[
                    ["Chance de Chuva", `${weatherData.precipitationChance}%`],
                    ["Índice UV", weatherData.uvIndex],
                    ["Vento", `${weatherData.windSpeed} km/h`],
                    ["Umidade", `${weatherData.humidity}%`],
                ].map(([label, value]) => (
                    <Card
                        key={label}
                        className="bg-[#161b22] border border-white/10 rounded-3xl p-6 text-white"
                    >
                        <h3 className="text-xl font-semibold mb-3">{label}</h3>
                        <p className="text-3xl font-bold">{value}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
