const {readdir, readFile, mkdir, unlink, copyFile, stat} = require('node:fs/promises');
const path = require('path');
const fs = require("fs");
const {rmdir} = require("fs/promises");

const stylesFiles = []
const rmFiles = (dName) => {
    readdir(dName, {withFileTypes:true}).then(files => {
        for (let file of files) {
            if (file.isDirectory()) {
                rmFiles(path.resolve(dName, file.name))
            }
            else {
                unlink(path.resolve(dName, file.name)).then(r => {
                });
            }
        }
    })
}
const readDir = (dName) => readdir(dName, {withFileTypes:true}).then(files=>{
    for (const file of files){
        if (file.isDirectory()){
            mkdir(path.resolve(__dirname, 'project-dist', path.basename((dName)), file.name), {recursive: true}).then(()=>{
                readDir(path.resolve(dName, file.name)).then(()=>{});
            })
        }
        else {
            copyFile(path.resolve(dName, file.name), path.resolve(__dirname, 'project-dist', 'assets', path.basename(dName), file.name)).then(() => {});
        }
    }
});
mkdir(path.resolve(__dirname, 'project-dist', 'assets'), {recursive: true}).then(() =>
    {
        readDir(path.resolve(__dirname, 'assets')).then(()=>{
            rmFiles(path.resolve(__dirname, 'project-dist', 'assets'));
        })
    }


).then(()=>{
    const writeTextStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'style.css'));
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

})

const readFileStream = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8');
let data = '';
readFileStream.on('data', chunkData => data += chunkData);
readFileStream.on('end', ()=>findTags());
const componentArray = [];
const tagsArray = []
const findTags = () => {
    readdir(path.resolve(__dirname, 'components'), {withFileTypes:true}).then( files => {
        for (const file of files) {
            tagsArray.push(file.name.split('.')[0]);
            componentArray.push(readFile(path.resolve(__dirname, 'components', file.name), 'utf-8'));
        }
    }).then(()=>{
        Promise.all(componentArray).then((components)=>{
            components.forEach((component, index)=>{
                data = data.replace(`{{${tagsArray[index]}}}`, component);
            })
        }).then(()=>{
            const writeTextStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'index.html'));
            writeTextStream.write(data);
        })
    })}
