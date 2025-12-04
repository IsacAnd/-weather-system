import pika
import json
import time
import os
from datetime import datetime, timezone
from weather_service import WeatherService
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


# ===============================
# VARIÁVEIS DE AMBIENTE
# ===============================
RABBITMQ_URL = get_env("RABBITMQ_URL")
RABBITMQ_QUEUE = get_env("RABBITMQ_QUEUE")
INTERVAL_SECONDS = int(get_env("INTERVAL_SECONDS"))
print(INTERVAL_SECONDS)

# Para o WeatherService (caso ele use internamente)
OPEN_METEO_URL = get_env("OPEN_METEO_URL")
LAT = get_env("LAT")
LON = get_env("LON")


# ===============================
# CONEXÃO COM RABBITMQ
# ===============================
parameters = pika.URLParameters(RABBITMQ_URL)
weather = WeatherService()

for i in range(10):
    try:
        connection = pika.BlockingConnection(parameters)
        print("✅ Conectado ao RabbitMQ!")
        break
    except pika.exceptions.AMQPConnectionError:
        print(f"❌ RabbitMQ não disponível, tentando de novo em 3s... (tentativa {i+1}/10)")
        time.sleep(3)
else:
    sys.exit(1)

channel = connection.channel()
channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)

print("✅ Producer iniciado e publicando dados...")


# ===============================
# LOOP PRINCIPAL
# ===============================
while True:
    try:
        data = weather.fetch_weather()

        if data:
            message = {
                "temperature": data["temperature"],
                "windspeed": data["windspeed"],
                "humidity": data["humidity"],
                "uvIndex": data["uvIndex"],
                "precipitationChance": data["precipitationChance"],
                "heatIndex": data["heatIndex"],
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "obs_timestamp": data.get("timestamp"),
                "source": "weather-api",
                "condition": data["condition"],
            }

            json_msg = json.dumps(message)

            channel.basic_publish(
                exchange="",
                routing_key=RABBITMQ_QUEUE,
                body=json_msg,
                properties=pika.BasicProperties(delivery_mode=2)
            )

            print("✅ Published:", json_msg)

    except Exception as e:
        print(f"❌ Error while publishing: {e}")

    time.sleep(INTERVAL_SECONDS)
