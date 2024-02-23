const { selectAllTopics, insertNewTopic} = require("../models/topics.model");

function getAllTopics(req, res, next) {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}
function postNewTopic(req,res,next){
  const {body} = req
  insertNewTopic(body).then((newTopic) => {
    res.status(201).send({newTopic})
  })
  .catch(next)
}

module.exports = { getAllTopics , postNewTopic};
