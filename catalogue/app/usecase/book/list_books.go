package book

import (
	"context"
	"gihyo/catalogue/domain/model"
	"gihyo/catalogue/domain/repository"
)

type ListBooksParams struct {
}

type ListBooks func(ctx context.Context) ([]*model.Book, error)

func NewListBooks(bookRepository repository.BookRepository) ListBooks {
	return func(ctx context.Context) ([]*model.Book, error) {
		return bookRepository.ListBooks(ctx)
	}
}
