const {
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticle,
} = require("../models/articles.models");
function getArticleById(req, res, next) {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}
function getAllArticles(req, res, next) {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}
function getCommentsByArticle(req, res, next) {
  const { article_id } = req.params;
  Promise.all([
    selectCommentsByArticle(article_id),
    selectArticleById(article_id),
  ])
    .then((comments) => {
      res.status(200).send({ comments: comments[0] });
    })
    .catch(next);
}

module.exports = { getArticleById, getAllArticles, getCommentsByArticle };
