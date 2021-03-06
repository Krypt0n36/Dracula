const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');


function getCipherKey(password) {
    return crypto.createHash('sha256').update(password).digest();
}

function main({file, password}){
    return new Promise((resolve, reject) => {
        try{
            //block of code
            const readInitVect = fs.createReadStream(file, { end: 15 });
            let initVect;
            readInitVect.on('data', (chunk) => {
                initVect = chunk;
            });
            readInitVect.on('close', () => {
                const cipherKey = getCipherKey(password);
                const readStream = fs.createReadStream(file, { start: 16 });
                const decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, initVect);
                const unzip = zlib.createUnzip();
                //new filename -- remove the .dnc extension
                file = file.replace('.dnc', '');
                const writeStream = fs.createWriteStream(file);

                readStream
                    .pipe(decipher)
                    .pipe(unzip)
                    .pipe(writeStream);

                readStream.on('end', () => { resolve(file) });
            })

        }
        catch(err){
            reject(err);
        }
    })
}

module.exports = main;