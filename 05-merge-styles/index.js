const {readdir, readFile} = require('node:fs/promises');
const path = require('path');
const fs = require("fs");

const stylesFiles = []
const writeTextStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'bundle.css'));

readdir(path.resolve(__dirname, 'styles'), {withFileTypes:true}).then(files=>{
    files.map(file =>{
        const filePath = path.resolve(__dirname, 'styles', file.name);
        if (!file.isDirectory() && path.extname(filePath) === '.css'){
            let data = ''
            stylesFiles.push(readFile(filePath, 'utf-8'));
        }
    })
}).then(()=>{
    Promise.all(stylesFiles).then((stylesInfo)=>{
        for (const styles of stylesInfo){
            writeTextStream.write(styles);
            writeTextStream.write('\n');
        }
    })
})
