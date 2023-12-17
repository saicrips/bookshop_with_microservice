db.createCollection("orders");
db.orders.createIndex({customerId: "hashed"});

function insert_orders(object) {
    print(db.orders.insert(object));
}

insert_orders({
    "_id": ObjectId("57a98d98e4b00679b4a830ad"),
    "customerId":   "test",
    "customerName": "技術 太郎",
    "orderItem": []
});
insert_orders({
    "_id": ObjectId("57a98d98e4b00679b4a830ae"),
    "customerId":   "test",
    "customerName": "技術 太郎",
    "orderItem": []
});
