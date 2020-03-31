const Jimp = require('jimp');
const fs = require('fs')
const path = require('path')
let total = 0;

const directoryPath = path.join(__dirname, 'photos')

const makeEmBetter = () => {
    
    new Promise(function(resolve, reject) {
        fs.readdir(directoryPath, (err, files) => {
            if(err){
                return('unable to read directory' + err)
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

                    Jimp.read(`./photos/${allPhotos[x]}`)
                    .then(image => {
                        return image
                            .color([
                                { apply: 'lighten', params: [5.5]},
                                { apply: 'saturate', params: [3]}
                            ])
                            .write(`./updatedPhotos/${withoutExtension}.JPEG`)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .then(_ => {
                        if(x < 2){
                            console.log(x + " Photo left!")
                        }else{
                            console.log(x + " Photo's left!")
                        }
                        resolve('next pic')
                    })
                })
            } 
        }
        editingPhotos(photos)
    })
}
makeEmBetter()



