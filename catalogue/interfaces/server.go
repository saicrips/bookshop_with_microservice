package interfaces

import (
	"gihyo/catalogue/interfaces/service"

	pb "gihyo/catalogue/proto/book"

	"gihyo/catalogue/app/usecase/book"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"gihyo/catalogue/domain/repository"
)

type ServerParams struct {
	BookRepository repository.BookRepository
}

func NewServer(params ServerParams) *grpc.Server {
	server := grpc.NewServer()

	bookService := service.NewBookServer(
		book.NewListBooks(params.BookRepository),
		book.NewGetBook(params.BookRepository),
	)

	reflection.Register(server)

	pb.RegisterCatalogueServer(server, bookService)

	return server

}
