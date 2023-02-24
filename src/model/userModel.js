const { query } = require("express");
const Pool = require("./../config/dbconfig");

const selectDataUser = (data) => {
  let { searchBy, search, sortBy, sort, limit, offset } = data;
  let qry = `SELECT id,name,email,phonenumber FROM old_users WHERE old_users.${searchBy} ILIKE '%${search}%' AND old_users.deleted_at IS NULL ORDER BY old_users.${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`;
  return Pool.query(qry);
};

// const selectDataUserById = (data) => {
//   let qry = `SELECT * FROM old_users WHERE id='${data}' and deleted_at IS NULL`;
//   // console.log(data, query);
//   return Pool.query(qry);
// };

const insertDataUser = (data) => {
  let { name, email, phonenumber, password } = data;
  let qry = `INSERT INTO old_users(name,email,phonenumber,password) VALUES('${name}','${email}','${phonenumber}',crypt('${password}',gen_salt('bf')) ) `;
  // console.log(data, query);
  return Pool.query(qry);
};

const updateDataUser = (id, data) => {
  let { name, email, phonenumber, password } = data;
  let qry = `UPDATE old_users SET name='${name}',email='${email}',phonenumber='${phonenumber}',password='${password}' WHERE id=${id}`;
  // console.log(data, qry);
  return Pool.query(qry);
};

const deleteDataUser = (id) => {
  let qry = `UPDATE old_users SET deleted_at = NOW()::timestamp WHERE id=${id}`;
  // console.log(id, qry);
  return Pool.query(qry);
};

/////////////////////

const selectDataUserById = (id) => {
  return new Promise((resolve,reject)=>
  Pool.query(`SELECT * FROM users WHERE id='${id}'`,
  (err,result)=>{
    if(!err){
      resolve(result)
    } else {
      reject(err)
    }
  }))
}

const findUser = (email) => {
  let qry = `SELECT * FROM users WHERE email='${email}'`;
  return new Promise((resolve, reject) =>
    Pool.query(qry, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const createUser = (data) => {
  const { email, fullname, password, otp, id } = data;
  let qry = `INSERT INTO users(id,email,fullname,password,otp,created_at) VALUES('${id}','${email}','${fullname}','${password}','${otp}', NOW()::timestamp)`;
  console.log(data);
  return new Promise((resolve, reject) =>
    Pool.query(qry, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const verifyUser = (id)=>{
  let qry = `UPDATE users SET verified = true WHERE id='${id}'`
  return new Promise((resolve, reject) =>
    Pool.query(qry, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
}

module.exports = {
  selectDataUser,
  insertDataUser,
  selectDataUserById,
  updateDataUser,
  deleteDataUser,
  createUser,
  findUser,
  verifyUser
};
