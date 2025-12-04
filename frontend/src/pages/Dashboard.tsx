import { useEffect, useState, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Menu } from "lucide-react";

import LogsSection from "../components/Logs";
import TableSection from "../components/Table";
import Overview from "../components/Overview";
import Charts from "../components/Charts";

import { api } from "../api/api";

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

type WeatherCondition =
    | "Ensolarado"
    | "Nublado"
    | "Chuvoso"
    | "Neblina"
    | "Tempestade";

type PageType = "overview" | "charts" | "logs" | "table";

export default function Dashboard() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [weatherData, setWeatherData] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [loadingWeather, setLoadingWeather] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState<PageType>("overview");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const [insight, setInsight] = useState<string | null>(null);
    const [loadingInsight, setLoadingInsight] = useState(false);
    const [insightError, setInsightError] = useState(false);

    const paginatedLogs = logs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(logs.length / itemsPerPage);

    // =====================================
    // ✅ BUSCAR LOGS
    // =====================================
    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.get<Log[]>("/api/weather/logs");
            setLogs(data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Erro ao buscar logs:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // =====================================
    // ✅ BUSCAR CLIMA ATUAL
    // =====================================
    const fetchCurrentWeather = useCallback(async () => {
        try {
            setLoadingWeather(true);
            const data = await api.get("/api/weather/current");
            setWeatherData(data);
        } catch (error) {
            console.error("Erro ao buscar clima atual:", error);
        } finally {
            setLoadingWeather(false);
        }
    }, []);

    // =====================================
    // ✅ GERAR INSIGHT
    // =====================================
    const fetchInsights = useCallback(async (data: Log[]) => {
        try {
            setLoadingInsight(true);
            setInsightError(false);

            const res = await api.post<{ insights: string }>(
                "/ai/weather-insights",
                { data }
            );

            setInsight(res.insights);
        } catch (err) {
            console.error(err);
            setInsightError(true);
            setInsight(null);
        } finally {
            setLoadingInsight(false);
        }
    }, []);

    // =====================================
    // ✅ DOWNLOAD
    // =====================================
    const downloadFile = async (type: "csv" | "xlsx") => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/weather/export/${type}`
            );

            if (!res.ok) throw new Error("Erro ao baixar");

            const blob = await res.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `weather_logs.${type}`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Erro ao baixar arquivo:", error);
        }
    };

    // =====================================
    // ✅ EFEITOS
    // =====================================
    useEffect(() => {
        fetchLogs();
        fetchCurrentWeather();
    }, [fetchLogs, fetchCurrentWeather]);

    useEffect(() => {
        if (logs.length > 0) {
            fetchInsights(logs);
        }
    }, [logs, fetchInsights]);

    // =====================================
    // ✅ UI
    // =====================================
    return (
        <div className="flex min-h-screen bg-[#0d1117] text-white">
            {/* SIDEBAR */}
            <aside
                className={`bg-[#161b22] border-r border-white/10 shadow-lg h-screen fixed top-0 left-0 transition-all duration-300
                ${sidebarOpen ? "w-64" : "w-0 opacity-0 pointer-events-none"}`}
            >
                <div className="p-6 flex items-center justify-between">
                    <h1
                        className={`text-xl font-bold transition-opacity duration-500 ${sidebarOpen ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        Weather Dashboard
                    </h1>
                </div>

                <nav className="p-4 space-y-2">
                    {["overview", "charts", "logs", "table"].map((page) => (
                        <button
                            key={page}
                            onClick={() => setActivePage(page as PageType)}
                            className={`w-full text-left px-4 py-2 rounded-xl transition-all font-medium
                                ${activePage === page
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-[#21262d]"
                                }`}
                        >
                            {page.charAt(0).toUpperCase() + page.slice(1)}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* MAIN */}
            <main
                className={`transition-all duration-300 flex-1 ${sidebarOpen ? "ml-64" : "ml-0"
                    }`}
            >
                {/* HEADER */}
                <header className="flex items-center justify-between p-6 bg-[#161b22] border-b border-white/10 shadow-sm">
                    <Button
                        variant="ghost"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu />
                    </Button>

                    <h2 className="text-2xl font-semibold capitalize">
                        {activePage}
                    </h2>

                    <div className="flex gap-2">
                        {(activePage === "logs" || activePage === "charts") && (
                            <Button onClick={fetchLogs} disabled={loading}>
                                {loading ? "Loading..." : "Refresh"}
                            </Button>
                        )}

                        <Button
                            onClick={() => {
                                localStorage.removeItem("token");
                                window.location.href = "/";
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </header>

                {/* CONTENT */}
                <div className="p-8">
                    {activePage === "overview" && (
                        <Overview
                            weatherData={weatherData}
                            loadingWeather={loadingWeather}
                            insight={insight}
                            loadingInsight={loadingInsight}
                            insightError={insightError}
                        />
                    )}

                    {activePage === "charts" && <Charts logs={logs} />}

                    {activePage === "logs" && (
                        <LogsSection
                            logs={paginatedLogs}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrev={() =>
                                setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            onNext={() =>
                                setCurrentPage((p) =>
                                    Math.min(p + 1, totalPages)
                                )
                            }
                        />
                    )}

                    {activePage === "table" && (
                        <TableSection
                            logs={paginatedLogs}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrev={() =>
                                setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            onNext={() =>
                                setCurrentPage((p) =>
                                    Math.min(p + 1, totalPages)
                                )
                            }
                            onDownloadCSV={() => downloadFile("csv")}
                            onDownloadXLSX={() => downloadFile("xlsx")}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
