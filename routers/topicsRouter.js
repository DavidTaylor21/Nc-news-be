const topicsRouter = require("express").Router();
const { getAllTopics, postNewTopic } = require("../controllers/topics.controller");

topicsRouter.get("", getAllTopics);
topicsRouter.post("", postNewTopic)

module.exports = topicsRouter;
