#!/bin/bash
cd `dirname $0`
cd ..

kubectl apply -f frontend/k8s/frontend.yaml
kubectl apply -f bff/k8s/bff.yaml
kubectl apply -f catalogue/k8s/catalogue.yaml
kubectl apply -f catalogue/k8s/catalogue-db.yaml

kubectl apply -f order/k8s/order.yaml
kubectl apply -f order/k8s/order-db.yaml
kubectl apply -f shipping/k8s/shipping.yaml
kubectl apply -f rabbitmq/k8s/rabbitmq.yaml

echo "wait..."
kubectl wait --for=condition=ready pods --all --timeout=120s
echo "deploy done"
