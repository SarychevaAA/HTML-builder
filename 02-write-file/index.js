const fs = require('fs');
const path = require('path');
const {text} = require("stream/consumers");
const readline = require("readline");
const process = require("node:process");
const input = process.stdin
const output = process.stdout
const {stdin, stdout } = process;
const writeTextStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));
const readStream = readline.createInterface({input, output});

stdout.write('Привет! Введите текст: ');
readStream.on('line', data => {
    readStream.on('exit', () => stdout.write('На этом всё! Удачи!\n'));
    if (data.toString().trim() === 'exit'){
        process.exit();
        console.log('yes');
    }
    else writeTextStream.write(data);
})

process.on('exit', () => stdout.write('На этом всё! Удачи!\n'));
