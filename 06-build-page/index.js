const {readdir, readFile, mkdir, unlink, copyFile} = require('node:fs/promises');
const path = require('path');
const fs = require("fs");

const stylesFiles = []

const writeTextStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'style.css'));
const readDir = (dName) => readdir(dName, {withFileTypes:true}).then(files=>{
    for (const file of files){
        if (file.isDirectory()){
            console.log(path.resolve(__dirname, 'project-dist', file.name))
            mkdir(path.resolve(__dirname, 'project-dist', file.name), {recursive: true}).then(()=>{
                readDir(path.resolve(dName, file.name)).then(()=>{});
            })
        }
        else {
            console.log(path.resolve(__dirname, 'project-dist', path.basename(dName), file.name))
            copyFile(path.resolve(dName, file.name), path.resolve(__dirname, 'project-dist', path.basename(dName), file.name)).then(() => {});
        }
    }
});
mkdir(path.resolve(__dirname, 'project-dist'), {recursive: true}).then(() =>
    {
        readdir(path.resolve(__dirname, 'project-dist'), {withFileTypes:true}).then((files)=>{
            files.map(file => unlink(path.resolve(path.resolve(__dirname, 'project-dist'), file.name)));
        }).then(()=>{
            readDir(path.resolve(__dirname, 'assets')).then(()=>{})
        })
    }


)

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
