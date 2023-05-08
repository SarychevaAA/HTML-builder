const fs = require('fs');
const {readdir} = require('node:fs/promises');
const path = require('path');

const findFiles = (dName) => readdir(dName, {withFileTypes:true});
findFiles(path.resolve(__dirname, 'secret-folder')).then((files)=>{
    for (const file of files){
        if (!file.isDirectory()){
            const filePath = path.resolve(__dirname, 'secret-folder', file.name);
            fs.stat(filePath, (err, data)=>{
                let fileInfo = `${path.basename(filePath)} - ${path.extname(filePath).slice(1)} - ${data.size} байт`;
                console.log(fileInfo);
            })
        }
    }
});
