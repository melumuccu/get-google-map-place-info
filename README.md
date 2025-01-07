Google Place API を使用して指定された場所の情報を取得し、結果をファイルに出力するツールです。

# HOW TO USE

## 1. 環境変数の設定

```bash
cp .env.example .env
```

.env ファイルに Google API キーを設定

※ API キーは以下の設定にする

- アプリケーションの制限: なし
- API の制限: Places API

## 2. 依存関係をインストール

```bash
pnpm install
```

## 3. make を実行

- XXXX は実際に Google Place API で検索したい場所名に置き換える

```bash
make "XXXX"
```

※ 検索結果は outputs/ ディレクトリに保存されます

# REFERENCES

- [Google Cloud Platform](https://console.cloud.google.com/apis/credentials)
- [Places API  |  Google Developers](https://developers.google.com/maps/documentation/places/web-service?hl=ja)
