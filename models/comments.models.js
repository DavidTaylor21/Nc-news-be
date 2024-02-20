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

module.exports = { insertComment, selectCommentsByArticle };
