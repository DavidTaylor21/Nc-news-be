const apiRouter = require("express").Router();
const getEndpoints = require("../controllers/api.controller");
const topicsRouter = require("./topicsRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const handleInvalidEndpointErrors = require("../errorHandling/handleInvalidEndpointErrors");
const usersRouter = require("./usersRouter");

apiRouter.get("", getEndpoints);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.all("/*", handleInvalidEndpointErrors);

module.exports = apiRouter;
