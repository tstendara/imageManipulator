const fs = require('fs')
const path = require('path')
const dirPath = path.join(__dirname, 'updatedPhotos')

new Promise(function(resolve, reject) {
    fs.readdir(dirPath, (err, files) => {
        if(err){
            console.log('unable to delete, ' + err)
        } else {
            resolve(files)
        }
    })
}).then(result => {
    for(let x = 1; x<result.length; x++){
        new Promise(function(resolve, reject) {
            fs.unlink(`./updatedPhotos/${result[x]}`, function(err) {
                if(err){
                    console.log('cant delete ' + result[x] + 'bc of' + err)
                } else {
                    resolve('next file')
                }
            })
        })
        
    }

})
