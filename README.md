# 🌦️ Weather Insight System — Full Stack com IA, Mensageria e Microsserviços

Sistema completo para coleta, processamento, armazenamento, visualização e geração de **insights inteligentes climáticos**, utilizando:

- **Frontend:** React + Vite  
- **Backend:** NestJS  
- **Banco de Dados:** MongoDB  
- **Mensageria:** RabbitMQ  
- **Workers:** Go + Python  
- **IA:** DeepSeek via OpenRouter  
- **Infraestrutura:** Docker & Docker Compose  

---

## 🧠 Visão Geral da Arquitetura
[ Producer (Python) ]
|
v
[ RabbitMQ ]
|
v
[ Worker (Go) ] ---> [ Backend (NestJS) ] ---> [ MongoDB ]
|
v
[ DeepSeek (IA) ]
|
v
[ Frontend (React) ]

---

## 🚀 Tecnologias Utilizadas

### Backend
- NestJS
- Mongoose
- JWT
- Bcrypt
- ConfigModule
- OpenRouter (DeepSeek)

### Frontend
- React
- Vite
- TailwindCSS
- React Router

### Infra
- Docker
- Docker Compose
- MongoDB
- RabbitMQ

### Workers
- Python Producer (coleta de dados)
- Go Worker (processamento)
- IA para geração de insights

---

## ✅ Pré-requisitos

Antes de começar, você precisa ter instalado:

- ✅ Docker
- ✅ Docker Compose
- ✅ Node.js 20+ (somente se for rodar local)
- ✅ Git

---

## 📁 Estrutura do Projeto
/
├── backend/
├── frontend/
├── producer/
├── worker/
├── docker-compose.yml
├── .env
└── README.md

---

## 🔐 Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto:

```env
# =========================
# RABBITMQ
# =========================
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672
RABBITMQ_QUEUE=weather_queue
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/

# =========================
# MONGODB
# =========================
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=example
MONGO_HOST=mongo
MONGO_PORT=27017
MONGO_DB=weather_db

# =========================
# BACKEND
# =========================
BACKEND_PORT=3000
WORKER_SECRET=change_me_to_a_strong_secret
JWT_SECRET=change_this_jwt_secret
BACKEND_INTERNAL_URL=http://backend:3000/api/weather/logs

# =========================
# FRONTEND
# =========================
FRONTEND_PORT=8080
VITE_BACKEND_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:3000/api

# =========================
# PRODUCER
# =========================
LAT=-3.71722
LON=-38.5434
INTERVAL_SECONDS=10
OPEN_METEO_URL=https://api.open-meteo.com/v1/forecast

# =========================
# GO WORKER
# =========================
NEST_BASE_URL=http://backend:3000

# =========================
# DEEPSEEK (IA)
# =========================
DS_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx
DS_MODEL=tngtech/deepseek-r1t2-chimera:free
DS_API_URL=https://openrouter.ai/api/v1/chat/completions
```



