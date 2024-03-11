const express = require("express");
const apiRouter = require("./routers/apiRouter");
const cors = require('cors')


const handleCustomErrors = require("./errorHandling/handleCustomErrors");
const handlePsqlErrors = require("./errorHandling/handlePsqlErrors");
const handleServerErrors = require("./errorHandling/handleServerErrors");

const app = express();
app.use(cors())

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
