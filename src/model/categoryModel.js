const { query } = require("express");
const Pool = require("./../config/dbconfig");

const selectDataCategory = () => {
  return Pool.query(`SELECT * FROM categories`);
};

const selectDataCategoryById = (data) => {
  let qry = `SELECT * FROM categories WHERE id='${data}'`;
  // console.log(data, query);
  return Pool.query(qry);
};

const insertDataCategory = (data) => {
  let { category_name } = data;
  let qry = `INSERT INTO categories(category_name) VALUES('${category_name}') `;
  // console.log(data, query);
  return Pool.query(qry);
};

const updateDataCategory = (id, data) => {
  let { category_name } = data;
  let qry = `UPDATE categories SET category_name='${category_name}' WHERE id=${id}`;
  console.log(data, qry);
  return Pool.query(qry);
};

const deleteDataCategory = (id) => {
  let qry = `DELETE FROM categories WHERE id=${id}`;
  console.log(id, qry);
  return Pool.query(qry);
};

module.exports = {
  selectDataCategory,
  insertDataCategory,
  selectDataCategoryById,
  updateDataCategory,
  deleteDataCategory,
};
