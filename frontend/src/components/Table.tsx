import { Button } from "./ui/button";
import { Card } from "./ui/card";

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
    condition: string;
}

interface TableSectionProps {
    logs: Log[];
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    onDownloadCSV: () => void;
    onDownloadXLSX: () => void;
}

export default function TableSection({
    logs,
    currentPage,
    totalPages,
    onPrev,
    onNext,
    onDownloadCSV,
    onDownloadXLSX,
}: TableSectionProps) {
    return (
        <Card className="rounded-3xl shadow-xl bg-[#161b22] border border-white/10 p-6 text-white">

            <h3 className="text-2xl font-semibold mb-6">Tabela de Registros</h3>

            {/* BOTÕES */}
            <div className="flex gap-3 mt-4 mb-4">
                <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={onDownloadCSV}
                >
                    Baixar CSV
                </Button>

                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={onDownloadXLSX}
                >
                    Baixar XLSX
                </Button>
            </div>

            {/* TABELA */}
            <div className="overflow-auto max-h-[70vh] rounded-2xl border border-white/10 bg-[#0d1117]">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-[#0d1117] sticky top-0 text-white border-b border-white/10">
                        <tr>
                            <th className="px-4 py-2">Fonte</th>
                            <th className="px-4 py-2">Temp (°C)</th>
                            <th className="px-4 py-2">Umidade (%)</th>
                            <th className="px-4 py-2">Vento (m/s)</th>
                            <th className="px-4 py-2">Heat Index</th>
                            <th className="px-4 py-2">Chance Chuva (%)</th>
                            <th className="px-4 py-2">UV</th>
                            <th className="px-4 py-2">Condição</th>
                            <th className="px-4 py-2">Data</th>
                        </tr>
                    </thead>

                    <tbody>
                        {logs.map((log, index) => (
                            <tr
                                key={log._id}
                                className={`
                  ${index % 2 === 0 ? "bg-[#0d1117]" : "bg-[#161b22]"}
                  hover:bg-blue-500/10 transition
                `}
                            >
                                <td className="px-4 py-3">{log.source}</td>
                                <td className="px-4 py-3">{log.temperature}</td>
                                <td className="px-4 py-3">{log.humidity}</td>
                                <td className="px-4 py-3">{log.windspeed}</td>
                                <td className="px-4 py-3">{log.heatIndex}</td>
                                <td className="px-4 py-3">{log.precipitationChance}</td>
                                <td className="px-4 py-3">{log.uvIndex}</td>
                                <td className="px-4 py-3">{log.condition}</td>
                                <td className="px-4 py-3">
                                    {new Date(log.timestamp).toLocaleString("pt-BR")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINAÇÃO */}
            <div className="flex justify-center mt-6 gap-6 bg-[#161b22]
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
        </Card>
    );
}
