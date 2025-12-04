FROM golang:1.20-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /worker main.go

FROM alpine:3.18
COPY --from=build /worker /worker
CMD ["/worker"]