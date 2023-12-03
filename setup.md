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