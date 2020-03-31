const Jimp = require('jimp');
const fs = require('fs')
const path = require('path')
let total = 0;

const directoryPath = path.join(__dirname, 'photos')
const originalFile = './photos' 
const editedFile = './updatedPhotos'

const readingDir = () => {
    
    new Promise(function(resolve, reject) {
        fs.readdir(directoryPath, (err, files) => {
            if(err){
                reject('unable to read directory' + err)

            } else {
                resolve(files)
            }
        })
    }).then(photos => { 
    
        const editingPhotos = (allPhotos) => {
            total = allPhotos.length;
    
            for( let x = 0; x<allPhotos.length; x++ ){
                let withoutExtension = allPhotos[x].slice(0, -4)

                new Promise(function(resolve, reject) {

                    Jimp.read(`${originalFile}/${allPhotos[x]}`)
                    .then(image => {
                        return image
                            .color([
                                { apply: 'brighten', params: [9]}
                            ])
                            .write(`${editedFile}/${withoutExtension}.JPEG`)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .then(_ => {
                        if(x === allPhotos.length - 1){
                            console.log('imageEditer3000 done')
                        }else{
                            console.log(total - (x + 1) + ` Photo's left`)
                        }
                        
                        resolve('next pic')
                    })
                })
            } 
        }
        editingPhotos(photos)
    })
}
readingDir()
