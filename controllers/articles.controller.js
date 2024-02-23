const {
  selectArticleById,
  selectAllArticles,
  updateVotesOnArticle,
  insertArticle,
} = require("../models/articles.models");

const {
  insertComment,
  selectCommentsByArticle,
} = require("../models/comments.models");

const { selectAllTopics } = require("../models/topics.model");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}
function getAllArticles(req, res, next) {
  const { sort_by, order, limit, p } = req.query;
  const topicQuery = req.query.topic;
  selectAllTopics()
    .then((allTopics) => {
      return selectAllArticles(
        topicQuery,
        allTopics,
        sort_by,
        order,
        limit,
        p
      ).then((articles) => {
        res.status(200).send({ articles });
      });
    })
    .catch(next);
}
function getCommentsByArticle(req, res, next) {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  Promise.all([
    selectCommentsByArticle(article_id, limit, p),
    selectArticleById(article_id),
  ])
    .then((comments) => {
      res.status(200).send({ comments: comments[0] });
    })
    .catch(next);
}
function postCommentForArticle(req, res, next) {
  const { article_id } = req.params;
  const body = req.body;
  Promise.all([selectArticleById(article_id), insertComment(article_id, body)])
    .then((comment) => {
      res.status(201).send({ comment: comment[1] });
    })
    .catch(next);
}
function patchVotesOnArticle(req, res, next) {
  const { article_id } = req.params;
  const votes = req.body.inc_votes;
  Promise.all([
    selectArticleById(article_id),
    updateVotesOnArticle(article_id, votes),
  ])
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle: updatedArticle[1] });
    })
    .catch(next);
}
function postArticle(req, res, next) {
  const { body } = req;
  insertArticle(body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}
module.exports = {
  getArticleById,
  getAllArticles,
  getCommentsByArticle,
  postCommentForArticle,
  patchVotesOnArticle,
  postArticle,
};
