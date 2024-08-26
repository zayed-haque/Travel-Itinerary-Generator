.PHONY: build run stop clean

build:
	docker-compose build

run:
	docker-compose up

stop:
	docker-compose down

clean:
	docker-compose down -v
	docker system prune -f

dev:
	docker-compose up

frontend-build:
	cd nomad-frontend && npm run build