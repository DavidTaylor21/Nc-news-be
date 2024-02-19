const { selectAllTopics } = require("../models/topics.model");

function getAllTopics(req, res, next) {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

module.exports = { getAllTopics };
