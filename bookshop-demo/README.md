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

# セットアップ その2

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
