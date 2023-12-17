set character_set_database=utf8;
set character_set_server=utf8;

CREATE USER IF NOT EXISTS 'catalogue_user' IDENTIFIED BY 'default_password';

GRANT ALL ON booksdb.* TO 'catalogue_user';

CREATE TABLE IF NOT EXISTS books (
	id int, 
	title varchar(40), 
	author varchar(20), 
	price int, 
	PRIMARY KEY(id)
);

INSERT INTO books (ID, title, author, price) 
VALUES 
(1, 'The Last Unicorn', 'Peter S. Beagle', 1299),
(2, 'The Moon is a Harsh Mistress', 'Robert A. Heinlein', 1599),
(3, 'The Name of the Wind', 'Patrick Rothfuss', 1899),
(4, 'The Three-Body Problem', 'Liu Cixin', 899),
(5, 'The Guide to the Galaxy', 'Douglas Adams', 999),
(6, 'The Great Gatsby', 'F. Scott Fitzgerald', 799),
(7, 'Pride and Prejudice', 'Jane Austen', 699),
(8, 'The Hunger Games', 'Suzanne Collins', 1199),
(9, 'The Hobbit', 'J.R.R. Tolkien', 899),
(10, 'The Catcher in the Rye', 'J.D. Salinger', 899);