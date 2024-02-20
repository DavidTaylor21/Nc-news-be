const db = require("../db/connection");

function selectCommentsByArticle(article_id) {
  return db
    .query(
      `SELECT * FROM comments
          WHERE article_id = $1
          ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}
function insertComment(article_id, bodyObj) {
  const author = bodyObj.username;
  const body = bodyObj.body;
  return db
    .query(
      `
    INSERT INTO comments
    (body, article_id, author)
    VALUES
    ($1,$2,$3)
    RETURNING *;`,
      [body, article_id, author]
    )
    .then((result) => {
        return result.rows[0];
    });
}

function removeComment(comment_id){
  return db.query(`
  DELETE FROM comments
  WHERE comment_id = $1 
  RETURNING *;`, [comment_id])
  .then((result)=>{
    if(result.rows.length === 0){
    return Promise.reject({status: 404, msg: 'comment does not exist'})
  }
})
}

module.exports = { insertComment, selectCommentsByArticle , removeComment};
