const express = require("express");
const {getAllTopics} = require('./controllers/topics.controller')
const getEndpoints = require('./controllers/api.controller')
const {getArticleById} = require('./controllers/articles.controller')
const handleCustomErrors = require('./errorHandling/handleCustomErrors')
const handlePsqlErrors = require('./errorHandling/handlePsqlErrors')

const app = express();

app.get('/api', getEndpoints)

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById)

app.all('/api/*', (req,res) =>{
    res.status(404).send({msg: 'Page not found'})
})

app.use(handleCustomErrors)
app.use(handlePsqlErrors)

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app;
