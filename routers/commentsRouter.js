const commentsRouter = require("express").Router();
const { deleteCommentById, patchVotesOnComment , getCommentById} = require("../controllers/comments.controller");

commentsRouter.route('/:comment_id')
.delete(deleteCommentById)
.patch(patchVotesOnComment)
.get(getCommentById)

module.exports = commentsRouter;
