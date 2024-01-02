# 必要アプリインストール

## go install
```bash
sudo add-apt-repository ppa:longsleep/golang-backports
sudo apt update
sudo apt install golang-go
```

### confirmation
```bash
go version
```

## protocol buffers install
```bash
curl -OL https://github.com/google/protobuf/releases/download/v3.9.0/protoc-3.9.0-linux-x86_64.zip
unzip protoc-3.9.0-linux-x86_64.zip -d protoc3
sudo mv protoc3/bin/* /usr/local/bin/
sudo mv protoc3/include/* /usr/local/include/
rm -rf protoc-3.9.0-linux-x86_64.zip protoc3
```

### confirmation
```bash
protoc --version
```

## go plag-in for protocol buffers
```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28 
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
```

### PATH
```bash
echo 'export PATH="$PATH:'$(go env GOPATH)'/bin"' >> ~/.zshrc
source ~/.zshrc
```

## node.js
```bash
sudo apt install nodejs npm
```

### confirmation
```bash
node --version
```

## kubectl
```bash
curl -LO "https://dl.k8s.io/release/$(curl -LS https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
```

### confirmation
```bash
kubectl version --client
```

## kind
```bash
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

### confirmation
```bash
kind --version
```

## istioctl
```bash
curl -L https://istio.io/downloadIstio | sh - 
cd ./istio-1.20.0
echo 'export PATH="'$PWD'/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### confirmation
```bash
istioctl version
```

# サブツール

## gRPCurl

```bash
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH

go get github.com/fullstorydev/grpcurl
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
```

# カタログ セットアップ

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

# bffセットアップ

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

# フロントエンドセットアップ

## Reactの初期化

```bash
npx create-react-app frontend 
```

## graphqlのインストール

```bash
npm install @apollo/client graphql
```

## サーバ起動

```bash
npm start
```

# K8Sセットアップ

# セットアップ

## Kubernetesクラスタの構築

```bash
kind create cluster
```

kindで作成したクラスタ一覧の確認
```bash
kind get clusters
```

## コンテナイメージの作成

各種フォルダで`Dockerfile`を作成する

### Catalogue

```bash
DOCKER_BUILDKIT=1 docker build -t bookshop/catalogue:0.1 catalogue/
```

`COPY --chmod`がそのままだと使えないので、`DOCKER_BUILDKIT=1`をつける

### bff

```bash
docker build -t bookshop/bff:0.1 bff/
```

### frontend

```bash
docker build -t bookshop/frontend:0.1 frontend/
```

## Kubernetesオブジェクトの記述

catalogue, bff, frontendのKubernetesオブジェクトを作成するためのYAMLファイルを書く

## Kubernetesへのデプロイ

Kubernetesにデプロイする前にローカル上のコンテナイメージをKubernetesクラスタにロードする

```bash
kind load docker-image bookshop/catalogue:0.1
kind load docker-image bookshop/bff:0.1 
kind load docker-image bookshop/frontend:0.1
```

Kubernetesへのデプロイ

```bash
kubectl apply -f bookshop-demo/catalogue/k8s/catalogue.yaml
kubectl apply -f bookshop-demo/bff/k8s/bff.yaml
kubectl apply -f bookshop-demo/frontend/k8s/frontend.yaml
```

デプロイの確認
```bash
kubectl get pod
```
サービスの確認

```bash
kubectl get service
```

## マイクロサービスの動作確認

Kubernetesクラスタ内のフロントエンドサービスにクラスタ外からアクセスするために、ポートフォワーディングを設定する

```bash
kubectl port-forward service/frontend 8080:80
```

bffも設定する
```bash
kubectl port-forward service/bff 4000:4000
```

```bash
kubectl port-forward service/catalogue 50051:50051
```

# K8Sセットアップ その２

## 事前準備

kindは一度作成したクラスタをあとからポート開放できないので、
すでにクラスタが作成されていたら一度削除しておく

```bash
kind delete cluster
```

configファイルを使用してkindクラスタを作成する

```bash
kind create cluster --config common/kind/kind-config.yaml
```

## Book Shopのデプロイ

```bash
./scripts/deploy_all.sh
```

デプロイされることを確認

```bash
kubectl get pod
```

```bash
kubectl get service
```

## Book Shopの動作確認

```bash
kubectl port-forward service/frontend 8080:80
```

```bash
kubectl port-forward service/bff 4000:4000
```

# インベントブローカー (order, shipping)

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

# Istioセットアップ

## Istioのインストール

```bash
istioctl install --set profile=demo -f common/istio/ingressgateway_NodePort.yaml -y
```

Istioの動作確認
```bash
kubectl get service -n istio-system
```

## アプリのデプロイ

```bash
./scripts/deploy_all.sh
```

defaultのnamespaceにラベルを付与し、namespace内で新しくデプロイされるアプリケーションに自動でサイドカープロキシを挿入する。
```bash
kubectl label namespace default istio-injection=enabled
```

デプロイしたアプリを一度削除し、サイドカープロキシを挿入できるようにする
```bash
./scripts/delete_all.sh
```
```bash
./scripts/deploy_all.sh
```

## Gatewayの登録

設定の適用
```bash
kubectl apply -f common/istio/ingress-gateway.yaml 
kubectl apply -f bff/istio/virtualservice.yaml
kubectl apply -f frontend/istio/virtualservice.yaml
```

## ルーティング制御

ルーティング制御の機能を試すため、フロントエンドの2つのバージョンをデプロイする(何回か更新するといずれかのバージョンが見れる)

```bash
kubectl delete deployment frontend
kubectl apply -f frontend/k8s/frontend-v1.yaml 
kubectl apply -f frontend/k8s/frontend-v2.yaml
```

ラウンドロビン方式による振り分け(交互に変わる)

```bash
kubectl apply -f frontend/istio/destinationrule.yaml
```

トラフィックをv1に75%, v2に25%の割合でルーティングする

```bash
kubectl apply -f frontend/istio/virtualservice-25-v2.yaml
```

## タイムアウト

意図的にカタログサービスで2秒間の遅延を発生させる

```bash
kubectl apply -f catalogue/istio/virtualservice-delay.yaml
```

0.5秒の遅延が発生するとタイムアウトとする
```bash
kubectl apply -f bff/istio/virtualservice-timeout.yaml
```

カタログサービスの遅延解除
```bash
kubectl delete -f catalogue/istio/virtualservice-delay.yaml
```

## サーキットブレーカー

サーキットブレーカーの適用
```bash
kubectl apply -f catalogue/istio/destinationrule-cb.yaml
```

意図的にカタログサービスに障害を発生させる
```bash
kubectl scale deployments catalogue-db --replicas=0
```

ブラウザに1回だけアクセスすると出てくるエラー
```
Error! 2 UNKNOWN: driver: bad connection
```

ブラウザにさらに3回以上アクセスすると出てくるエラー
```
Error! 14 UNAVAILABLE: no healthy upstream
```

# サービス間の通信セキュリティ

## TLS通信のみに制限する

「STRINCT」(デフォルトだと「PERMISSIVE」)モードにすると相互TLSトラフィックのみを許可する

```bash
kubectl apply -f common/istio/peer-authentication-mtls.yaml
```

## JWT検証

Ingress Gatewayに対してRequest Authenticationを設定
```bash
kubectl apply -f common/istio/request-authentication-keycloak.yaml
```

## 認可制御

AythorizationPolicyを使用した認可設定
```bash
kubectl apply -f common/istio/authorization-policy-keycloak.yaml
```

# 認証・認可

## 認証・認可の実装

1. KeyCloakのデプロイ

  1. KeyCloakの起動

bookshop-demoディレクトリに移動
```bash
kubectl apply -f auth/k8s/keycloak.yaml
```

起動の確認
```bash
kubectl get pod -n keycloak
```

  2. Realmの作成

  `localhost:8080/admin`にアクセス

  3. ユーザの作成

  4. アプリケーションのクライアントを登録

2. フロントエンドと認証サーバの連携

フロントエンドサーバに移動
```bash
npm i keycloak-js
```

3. 動作確認

localhostにアクセスすると