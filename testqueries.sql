-- Active: 1676385422076@@127.0.0.1@5432@recipes
INSERT into users(name, email,phonenumber) VALUES('Testname','Testemail','Testphonenumber');

SELECT * from users;

INSERT INTO users(name,email,phonenumber) VALUES'${data}';

CREATE EXTENSION pgcrypto;

SELECT * from recipes;
INSERT INTO recipes(ingredients,title,photo,users_id,created_at) VALUES('-Egg, \n -Sandwich, \n Seasonings','Sandwich with Egg','http://localhost',1,now());

INSERT INTO recipes(ingredients,title,photo,users_id,created_at) VALUES('-Banana, \n -Bread','Banana Bread','http://localhost',2,now());

INSERT INTO categories(category_name) VALUES('Poultry');

SELECT recipes.title,recipes.ingredients,recipes.created_at, users.name as author, categories.category_name as category FROM recipes 
JOIN categories ON recipes.categories_id=categories.id 
JOIN users ON recipes.users_id=users.id 
WHERE recipes.title ILIKE '%%' AND recipes.deleted_at IS NULL ORDER BY recipes.created_at ASC;

UPDATE recipes SET title='Sandwich with Telur',ingredients='-Egg, \n -Sandwich, \n Seasonings',photo='http://localhost',users_id='1',created_at='2023-02-16T09:09:13.135Z' WHERE id=1
