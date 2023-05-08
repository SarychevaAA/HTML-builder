const {readdir, mkdir, copyFile, unlink} = require('node:fs/promises');
const path = require('path');

mkdir(path.resolve(__dirname, 'files-copy'), {recursive: true}).then(() =>
    {
        readdir(path.resolve(__dirname, 'files-copy'), {withFileTypes:true}).then((files)=>{
            files.map(file => unlink(path.resolve(path.resolve(__dirname, 'files-copy'), file.name)));
        }).then(()=>{
            readdir(path.resolve(__dirname, 'files'), {withFileTypes:true}).then(files=>{
                for (const file of files){
                    copyFile(path.resolve(__dirname, 'files', file.name), path.resolve(__dirname, 'files-copy', file.name)).then(() => {});
                }
            })
        })
    }


)
