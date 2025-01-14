.PHONY: run start

%:
	@make start INPUT="$*"

start:
	npx tsc && node dist/src/index.js "$(INPUT)"
