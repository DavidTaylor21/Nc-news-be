const fs = require('fs/promises')
function readApiIinformation(){
    return fs.readFile('endpoints.json', 'utf8')
    .then((response)=>{
        return JSON.parse(response)
    })
}

module.exports = readApiIinformation