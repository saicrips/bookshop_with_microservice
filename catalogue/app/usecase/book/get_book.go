package book

import (
	"context"
	"gihyo/catalogue/domain/model"
	"gihyo/catalogue/domain/repository"
)

type GetBooksParams struct {
	ID int
}

type GetBook func(ctx context.Context, params GetBooksParams) (*model.Book, error)

func NewGetBook(bookRepository repository.BookRepository) GetBook {
	return func(ctx context.Context, params GetBooksParams) (*model.Book, error) {
		return bookRepository.GetBook(ctx, params.ID)
	}
}
