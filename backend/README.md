# セットアップ

## プロトコルバッファインターフェースの生成

1. `/catalogue/proto/book/`に移動する
```bash
protoc --go_out=. --go_opt=paths=source_relative \
  --go-grpc_out=. --go-grpc_opt=paths=source_relative \
  catalogue.proto
```

2. バックエンドサーバの実装

goプロジェクトの生成
```bash
go mod init book_shop_micro_service/catalogue
```

gRPCを利用するためのコマンド
```bash
go get google.golang.org/grpc
```

## サーバの実行

```bash
go run main.go
```

## gRPCurlによるgRPCサーバ確認

### サービスの確認
```bash
grpcurl -plaintext localhost:50051 list
```

### `book.Catalogue`サービスのメソッド確認
```bash
grpcurl -plaintext localhost:50051 list book.Catalogue
```

### GetBookメソッドにリクエスト
GetBookメソッドにidが1の書籍情報をリクエスト

```bash
grpcurl -plaintext -d '{"id": 1}' localhost:50051 book.Catalogue.GetBook
```
返却データ
```json
{
  "book": {
    "id": 1,
    "title": "The Awakening",
    "author": "Kate Chopin",
    "price": 1000
  }
}
```

## Apollo Serverを使ったBFFの実装

### Node.jsプロジェクトの初期化
```bash
npm init --yes
```

### ライブラリインストール
```bash
npm install @apollo/server express graphql cors body-parser
```

### gRPCのインストール
```bash
npm install @grpc/grpc-js @grpc/proto-loader
```