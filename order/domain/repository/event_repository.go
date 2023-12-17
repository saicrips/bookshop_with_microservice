package repository

import (
	"context"

	"gihyo/order/domain/model"
)

type EventRepository interface {
	PostOrderEvent(ctx context.Context, orderEvent model.OrderEvent) error
}
