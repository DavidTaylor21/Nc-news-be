const {removeComment, selectCommentById, updateVotesOnComment} = require('../models/comments.models')
function deleteCommentById(req,res,next){
    const {comment_id} = req.params
    removeComment(comment_id).then(() => {
        res.status(204).send()
    })
    .catch(next)
}
function getCommentById(req,res,next){
    const { comment_id } = req.params;
    selectCommentById(comment_id)
      .then((comment) => {
        res.status(200).send({ comment });
      })
      .catch(next);
}
function patchVotesOnComment(req,res,next){
    const { comment_id } = req.params;
    const votes = req.body.inc_votes;
    Promise.all([
      selectCommentById(comment_id),
      updateVotesOnComment(comment_id, votes),
    ])
      .then((updatedComment) => {
        res.status(200).send({ updatedComment : updatedComment[1] });
      })
      .catch(next);
}
module.exports = {deleteCommentById,getCommentById, patchVotesOnComment}