const fs = require('fs');
const path = require('path');
const {text} = require("stream/consumers");
const { stdout } = process;

const readFileStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');
let data = '';
readFileStream.on('data', chunkData => data += chunkData);
readFileStream.on('end', ()=>stdout.write(data));
readFileStream.on('error', ()=>stdout.write(error.message));

