const { query } = require("express");
const Pool = require("./../config/dbconfig");

const selectDataRecipe = (data) => {
  let {searchBy,search,sortBy,sort} = data
  return Pool.query(
    `SELECT recipes.title,recipes.ingredients,recipes.created_at as posttime, categories.category_name as category, users.fullname as author 
    FROM recipes 
    JOIN categories ON recipes.categories_id=categories.id
    JOIN users ON recipes.users_id = users.id
    WHERE recipes.${searchBy} ILIKE '%${search}%' AND recipes.deleted_at IS NULL ORDER BY recipes.${sortBy} ${sort}`
  );
}

const selectDataRecipeById = (data) => {
  let {searchBy,search,sortBy,sort,id} = data
  return Pool.query(
    `SELECT recipes.title,recipes.ingredients,recipes.created_at as posttime, categories.category_name as category , users.fullname as author
    FROM recipes 
    JOIN categories ON recipes.categories_id=categories.id
    JOIN users ON recipes.users_id = users.id
    WHERE recipes.${searchBy} ILIKE '%${search}%' AND recipes.deleted_at IS NULL AND recipes.users_id='${id}' ORDER BY recipes.${sortBy} ${sort}`
  );
}

//khusus untuk function insert
const selectDataRecipeByIdForPut = (data)=>{
  let qry = `SELECT * FROM recipes WHERE id=${data}`;
  return Pool.query(qry);
}

const insertDataRecipe = (data) => {
  let { title, ingredients, photo, users_id,categories_id} = data;
  let qry = `INSERT INTO recipes(title,ingredients,photo,users_id,created_at, categories_id) 
  VALUES('${title}','${ingredients}','${photo}','${users_id}',NOW()::timestamp, ${categories_id}) `;
  // console.log(data, query);
  return Pool.query(qry);
};

const updateDataRecipe = (id, data) => {
  let { title, ingredients, photo, users_id, created_at } = data;
  created_at = created_at.toISOString();
  let qry = `UPDATE recipes SET title='${title}',ingredients='${ingredients}',photo='${photo}',users_id='${users_id}',created_at='${created_at}' WHERE id=${id}`;
  console.log(`data, query = `);
  console.log(data, qry);
  console.log(`created at : ${created_at}` );
  return Pool.query(qry);
};

const deleteDataRecipe = (id) => {
  let qry = `UPDATE recipes SET deleted_at = NOW()::timestamp WHERE id=${id}`;
  console.log(id, qry);
  return Pool.query(qry);
};

module.exports = {
  selectDataRecipe,
  insertDataRecipe,
  selectDataRecipeById,
  selectDataRecipeByIdForPut,
  updateDataRecipe,
  deleteDataRecipe,
};
