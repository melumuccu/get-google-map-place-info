.PHONY: run start

%:
	@make start INPUT="$*"

start:
	rm -rf dist && npx tsc && node dist/index.js "$(INPUT)"
