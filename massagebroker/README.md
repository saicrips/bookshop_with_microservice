# インベントブローカー

## メッセージブローカーの構築

RabbitMQをDockerコンテナ上で起動する

```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management
```

## メッセージ送信側の実装

goプロジェクトの作成
```bash
go mod init massagebroker/order
```

作成したgoプロジェクトでrabbitMQのクライアントライブラリをいれる
```bash
go get github.com/rabbitmq/amqp091-go
```

実装後の確認
```bash
$ go run main.go
2023/12/17 11:26:09  [x] Sent {"ID":"test_id","CustomerId":"test","CustomerName":"customer name","OrderItem":[]}
```

## メッセージ受信側の実装

goプロジェクトの作成
```bash
go mod init massagebroker/shipping
```

作成したgoプロジェクトでrabbitMQのクライアントライブラリをいれる
```bash
go get github.com/rabbitmq/amqp091-go
```

実装後の確認
```bash
$ go run main.go
2023/12/17 11:44:36 Received a message: {"ID":"test_id","CustomerId":"test","CustomerName":"customer name","OrderItem":[]}
```