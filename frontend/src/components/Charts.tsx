import { Card, CardContent } from "./ui/card";
import WeatherLineChart from "./WeatherLineChart";

export interface Log {
    _id: string;
    source: string;
    temperature: number;
    windspeed: number;
    timestamp: string;
    humidity: number;
    uvIndex: number;
    precipitationChance: number;
    heatIndex: number;
    condition: WeatherCondition;
}

export interface ChartsProps {
    logs: Log[];
}

type WeatherCondition =
    | "Ensolarado"
    | "Nublado"
    | "Chuvoso"
    | "Neblina"
    | "Tempestade";

export default function Charts({ logs }: ChartsProps) {
    const chartFields: Array<[string, keyof Log, string]> = [
        ["Temperature", "temperature", "#ff5722"],
        ["Humidity", "humidity", "#2196f3"],
        ["Heat Index", "heatIndex", "#ff9800"],
        ["Wind Speed", "windspeed", "#673ab7"],
    ];
    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {chartFields.map(([label, key, color]) => (
                <Card
                    key={key}
                    className="rounded-3xl shadow-md bg-[#161b22] border border-white/10 text-white"
                >
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">{label}</h3>
                        <WeatherLineChart logs={logs} dataKey={key} color={color} />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}