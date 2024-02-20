function handleInvalidEndpointErrors (req,res){
    res.status(404).send({msg: 'Page not found'})
}
module.exports = handleInvalidEndpointErrors