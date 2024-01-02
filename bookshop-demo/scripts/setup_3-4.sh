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

kubectl apply -f common/istio/ingress-gateway.yaml

kubectl apply -f frontend/istio/virtualservice.yaml
kubectl apply -f frontend/istio/destinationrule.yaml
kubectl apply -f bff/istio/virtualservice.yaml
kubectl apply -f bff/istio/destinationrule.yaml

kubectl apply -f common/istio/peer-authentication-mtls.yaml 
kubectl apply -f common/istio/request-authentication-keycloak.yaml
kubectl apply -f common/istio/authorization-policy-keycloak.yaml

echo "wait..."
kubectl wait --for=condition=ready pods --all --timeout=90s
echo "deploy done"
