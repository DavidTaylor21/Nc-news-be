const db = require("../db/connection");
function selectAllTopics() {
  return db
    .query(
      `
    SELECT * 
    FROM topics;`
    )
    .then((result) => {
      return result.rows;
    });
}
function insertNewTopic(body) {
  const { slug, description } = body;
  if (!description) {
    return Promise.reject({status: 400, msg : "content missing from body"});
  }
  return db
    .query(
      `
    INSERT INTO topics
    (slug, description)
    VALUES
    ($1,$2)
    RETURNING *`,
      [slug, description]
    )
    .then((response) => {
      return response.rows[0];
    });
}

module.exports = { selectAllTopics, insertNewTopic };
