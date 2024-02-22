const db = require("../db/connection");
function selectAllUsers() {
  return db
    .query(
      `
    SELECT * FROM users;`
    )
    .then((response) => {
      return response.rows;
    });
}
function selectUserByUsername(username) {
  return db
    .query(
      `
  SELECT * FROM users
  WHERE username = $1;`,
      [username]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user not found" });
      } else {
        return result.rows[0];
      }
    });
}

module.exports = { selectAllUsers, selectUserByUsername };
