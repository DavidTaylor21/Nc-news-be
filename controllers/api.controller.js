const readApiIinformation = require('../models/api.model')
function getApiInformation(req,res,next){
    readApiIinformation().then((endpointsInformation)=>{
        res.status(200).send({endpointsInformation})
    })
}
module.exports = getApiInformation