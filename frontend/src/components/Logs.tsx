import { Card, CardContent } from "./ui/card";

export interface Log {
    _id: string;
    source: string;
    temperature: number;
    windspeed: number;
    timestamp: string;
    humidity: number;
}

interface LogsSectionProps {
    logs: Log[];
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
}

export default function LogsSection({
    logs,
    currentPage,
    totalPages,
    onPrev,
    onNext,
}: LogsSectionProps) {
    return (
        <div className="w-full">

            {/* GRID DE LOGS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {logs.map((log) => (
                    <Card
                        key={log._id}
                        className="rounded-2xl shadow-lg bg-gradient-to-br from-[#161b22] to-[#1f2937]
            border border-white/10 text-white hover:scale-[1.02] transition"
                    >
                        <CardContent className="p-5">
                            <h2 className="text-lg font-semibold mb-2 text-blue-400">
                                {log.source}
                            </h2>

                            <div className="space-y-1 text-sm text-gray-300">
                                <p><span className="text-gray-400">🌡 Temp:</span> {log.temperature} °C</p>
                                <p><span className="text-gray-400">💨 Vento:</span> {log.windspeed} m/s</p>
                                <p><span className="text-gray-400">💧 Umidade:</span> {log.humidity}%</p>
                            </div>

                            <p className="text-xs text-gray-500 mt-4">
                                {new Date(log.timestamp).toLocaleString("pt-BR")}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* PAGINAÇÃO */}
            <div className="flex justify-center mt-10 gap-6 bg-[#161b22]
        px-6 py-3 rounded-2xl border border-white/10 shadow-lg">

                <button
                    onClick={onPrev}
                    disabled={currentPage === 1}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
          disabled:bg-gray-700 disabled:opacity-40 transition font-medium"
                >
                    ← Anterior
                </button>

                <span className="text-gray-300 font-medium">
                    Página <span className="text-white font-semibold">{currentPage}</span> de{" "}
                    <span className="text-white font-semibold">{totalPages}</span>
                </span>

                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
          disabled:bg-gray-700 disabled:opacity-40 transition font-medium"
                >
                    Próxima →
                </button>
            </div>
        </div>
    );
}
