package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Payload struct {
	Temperature         float64 `json:"temperature"`
	Windspeed           float64 `json:"windspeed"`
	Humidity            float64 `json:"humidity"`
	UVIndex             float64 `json:"uvIndex"`
	PrecipitationChance float64 `json:"precipitationChance"`
	HeatIndex           float64 `json:"heatIndex"`
	Timestamp           string  `json:"timestamp"`
	ObsTimestamp        string  `json:"obs_timestamp"`
	Source              string  `json:"source"`
	Condition           string  `json:"condition"`
}

// helper seguro para variáveis obrigatórias
func getEnv(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatalf("Variável de ambiente obrigatória não definida: %s", key)
	}
	return val
}

func main() {
	for {
		err := runWorker()
		log.Println("Worker error, retrying in 5s:", err)
		time.Sleep(5 * time.Second)
	}
}

func runWorker() error {
	// ===============================
	// VARIÁVEIS DE AMBIENTE
	// ===============================
	rabbitURL := getEnv("RABBITMQ_URL")
	queueName := getEnv("RABBITMQ_QUEUE")
	backendURL := getEnv("BACKEND_INTERNAL_URL")
	workerSecret := getEnv("WORKER_SECRET")

	// ===============================
	// CONEXÃO COM RABBITMQ
	// ===============================
	conn, err := amqp.Dial(rabbitURL)
	if err != nil {
		return fmt.Errorf("rabbitmq dial: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("channel: %v", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("queue declare: %v", err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("consume: %v", err)
	}

	client := &http.Client{Timeout: 10 * time.Second}

	log.Println("✅ Worker iniciado e aguardando mensagens...")

	for d := range msgs {
		var p Payload
		if err := json.Unmarshal(d.Body, &p); err != nil {
			log.Println("❌ Payload inválido:", err)
			d.Nack(false, false)
			continue
		}

		body, _ := json.Marshal(p)

		req, err := http.NewRequest(
			"POST",
			backendURL,
			bytes.NewReader(body),
		)
		if err != nil {
			log.Println("❌ Erro ao criar request:", err)
			d.Nack(false, true)
			continue
		}

		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-WORKER-SECRET", workerSecret)

		resp, err := client.Do(req)
		if err != nil {
			log.Println("❌ POST falhou:", err)
			d.Nack(false, true)
			continue
		}
		resp.Body.Close()

		if resp.StatusCode >= 400 {
			log.Println("❌ Backend retornou erro:", resp.StatusCode)
			d.Nack(false, true)
			continue
		}

		d.Ack(false)
		log.Println("✅ Processado:", p.Timestamp)
	}

	return fmt.Errorf("channel closed")
}
