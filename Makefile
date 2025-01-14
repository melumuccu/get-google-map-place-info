.PHONY: run start

%:
	@make start INPUT="$*"

start:
	npx tsc && node dist/index.js "$(INPUT)"
