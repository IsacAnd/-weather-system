import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import type { Log } from "../pages/Dashboard"

interface WeatherLineChartProps {
    logs: Log[];
    dataKey: keyof Log;
    color: string;
}

export default function WeatherLineChart({ logs, dataKey, color }: WeatherLineChartProps) {
    if (!logs || logs.length === 0) return <p>No data available</p>;

    const formatted = logs
        .map((l) => ({
            time: new Date(l.timestamp).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
            ts: new Date(l.timestamp).getTime(),
            value: l[dataKey],
        }))
        .sort((a, b) => a.ts - b.ts);

    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={formatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={color} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
}