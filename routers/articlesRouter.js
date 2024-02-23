const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticle,
  postCommentForArticle,
  patchVotesOnArticle,
  postArticle,
} = require("../controllers/articles.controller");
articlesRouter.get('', getAllArticles)
articlesRouter.post('', postArticle);
articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticle)
.post(postCommentForArticle);
articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchVotesOnArticle);

module.exports = articlesRouter;
