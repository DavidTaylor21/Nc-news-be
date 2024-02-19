const db = require('../db/connection')
function selectArticleById(article_id){
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1`, [article_id])
    .then((response)=>{
        return response.rows[0]
    })
}

module.exports = {selectArticleById}