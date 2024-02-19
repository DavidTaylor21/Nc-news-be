function handlePsqlErrors(err,req,res,next){
    if(err.code === '23502'){res.status(400).send({msg: 'Bad request'})}
    else if(err.code === '22P02'){
        res.status(400).send({msg:"Bad request"})
    }
    next(err)
}
module.exports = handlePsqlErrors