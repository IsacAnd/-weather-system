import os
import requests
from datetime import datetime
import sys


# ===============================
# FUNÇÃO PARA ENVs OBRIGATÓRIAS
# ===============================
def get_env(key: str) -> str:
    value = os.getenv(key)
    if not value:
        print(f"❌ Variável de ambiente obrigatória não definida: {key}")
        sys.exit(1)
    return value


class WeatherService:
    def __init__(self):
        # ===============================
        # VARIÁVEIS DE AMBIENTE
        # ===============================
        base_url = get_env("OPEN_METEO_URL")
        lat = get_env("LAT")
        lon = get_env("LON")

        self.api_url = (
            f"{base_url}?latitude={lat}&longitude={lon}"
            "&current_weather=true"
            "&hourly=relativehumidity_2m,uv_index,precipitation_probability,apparent_temperature"
        )

        print("✅ WeatherService configurado com sucesso")
        print("➡️ URL:", self.api_url)

    def fetch_weather(self):
        try:
            response = requests.get(self.api_url, timeout=10)
            response.raise_for_status()
            data = response.json()

            cw = data["current_weather"]
            hourly = data["hourly"]

            t = datetime.fromisoformat(cw["time"])
            t_hour = t.replace(minute=0, second=0).isoformat(timespec="minutes")

            condition = self.map_weather_code(cw["weathercode"])

            try:
                idx = hourly["time"].index(t_hour)
            except ValueError:
                idx = 0

            return {
                "temperature": cw["temperature"],
                "windspeed": cw["windspeed"],
                "humidity": hourly["relativehumidity_2m"][idx],
                "uvIndex": hourly["uv_index"][idx],
                "precipitationChance": hourly["precipitation_probability"][idx],
                "heatIndex": hourly["apparent_temperature"][idx],
                "condition": condition,
                "timestamp": cw["time"],
            }

        except requests.exceptions.RequestException as e:
            print(f"❌ Erro HTTP ao buscar clima: {e}")
            return None
        except KeyError as e:
            print(f"❌ Erro ao acessar campo inesperado da API: {e}")
            return None
        except Exception as e:
            print(f"❌ Erro inesperado no WeatherService: {e}")
            return None

    def map_weather_code(self, code: int) -> str:
        if code == 0:
            return "Ensolarado"
        if code in [1, 2, 3]:
            return "Nublado"
        if code in [45, 48]:
            return "Neblina"
        if code in [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]:
            return "Chuvoso"
        if code in [95, 96, 99]:
            return "Tempestade"

        return "Desconhecido"
