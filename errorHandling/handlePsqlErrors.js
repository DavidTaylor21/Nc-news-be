function handlePsqlErrors(err,req,res,next){
    if(err.code === '23503'){
        const key = err.detail.match(/(?!\()(\w+)(?=\))/i)
        res.status(400).send({msg : `not a valid ${key[0]}`})
    }
    if(err.code === '23502' && err.detail === undefined){
        res.status(404).send({msg: 'content not found'})}
    if(err.code === '22P02'){
        res.status(400).send({msg: "Bad request"})
    }
    if(err.code = '23502' && err.detail.includes('Failing row')){
        res.status(400).send({msg: "content missing from body"})
    }
    if(err.code = '23505'){
        const key = err.detail.match(/(?!\()(\w+)(?=\))/i)
        res.status(400).send({msg : `${key[0]} already exists`})
    }
    next(err)
}
module.exports = handlePsqlErrors