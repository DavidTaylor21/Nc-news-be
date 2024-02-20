function handlePsqlErrors(err,req,res,next){
    if(err.code === '23502' && err.detail === undefined){
        res.status(404).send({msg: 'Bad request'})}
    else if(err.code === '22P02'){
        res.status(400).send({msg: "Bad request"})
    }
    else if(err.code = 23502 && err.detail.includes('Failing row')){
        res.status(400).send({msg: "content missing from body"})
    }
    next(err)
}
module.exports = handlePsqlErrors