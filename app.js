const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const getEndpoints = require("./controllers/api.controller");
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticle,
  postCommentForArticle,
  patchVotesOnArticle
} = require("./controllers/articles.controller");
const handleCustomErrors = require("./errorHandling/handleCustomErrors");
const handlePsqlErrors = require("./errorHandling/handlePsqlErrors");
const handleServerErrors = require("./errorHandling/handleServerErrors");
const handleInvalidEndpointErrors = require("./errorHandling/handleInvalidEndpointErrors");
const {deleteCommentById} = require('./controllers/comments.controller')
const {getAllUsers, getUserByUsername} = require('./controllers/users.controller')

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);
app.post("/api/articles/:article_id/comments", postCommentForArticle);
app.patch("/api/articles/:article_id", patchVotesOnArticle)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getAllUsers)
app.get('/api/users/:username', getUserByUsername)

app.all("/api/*", handleInvalidEndpointErrors);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
