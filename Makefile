start:
	npx tsc && node dist/index.js $(INPUT)

run:
	@make start INPUT=$(INPUT)
