#!/bin/bash
cd `dirname $0`
cd ..

kubectl delete -f frontend/k8s/
kubectl delete -f bff/k8s/
kubectl delete -f catalogue/k8s/
kubectl delete -f order/k8s
kubectl delete -f shipping/k8s/
kubectl delete -f rabbitmq/k8s/
