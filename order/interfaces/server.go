package interfaces

import (
	"gihyo/order/interfaces/service"

	pb "gihyo/order/proto/order"

	"gihyo/order/app/usecase/order"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"gihyo/order/domain/repository"
)

type ServerParams struct {
	OrderRepository repository.OrderRepository
	EventRepository repository.EventRepository
}

func NewServer(params ServerParams) *grpc.Server {
	server := grpc.NewServer()

	orderService := service.NewOrderServer(
		order.NewListOrders(params.OrderRepository),
		order.NewGetOrder(params.OrderRepository),
		order.NewCreateOrder(params.OrderRepository, params.EventRepository),
	)

	reflection.Register(server)

	pb.RegisterOrderServiceServer(server, orderService)

	return server

}
