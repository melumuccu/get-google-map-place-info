# デフォルトターゲット
.PHONY: run start

# 任意のターゲットを指定した場合の処理
# $* でターゲット名を取得し、INPUTとして渡す
%:
	@make start INPUT="$*"

# メインのビルド＆実行ターゲット
# TypeScriptをコンパイル後、指定されたINPUT引数でアプリケーションを実行
start:
	npx tsc && node dist/index.js "$(INPUT)"
