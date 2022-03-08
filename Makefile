run-dev:
	docker-compose exec node bash -c "cd bushin && npm run dev"
firebase-start:
	docker-compose exec firebase bash -c "firebase emulators:start --import=/opt/workspace/data --export-on-exit"