# Places API用のコマンド（コメントアウト）
# .PHONY: run start
#
# %:
#	@make start INPUT="$*"
#
# start:
#	npx tsc && node dist/index.js "$(INPUT)"

# Places API(New)用のコマンド
.PHONY: run start

%:
	@make start INPUT="$*"

start:
	npx tsc && node dist/places-new/index.js "$(INPUT)"
