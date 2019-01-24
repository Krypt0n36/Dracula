const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');



function getCipherKey(password) {
    return crypto.createHash('sha256').update(password).digest();
}

function decrypt({ file, password }, error_callback, done_callback) {
    // First, get the initialization vector from the file.
    const readInitVect = fs.createReadStream(file, { end: 15 });

    let initVect;
    readInitVect.on('data', (chunk) => {
        initVect = chunk;
    });

    // Once we’ve got the initialization vector, we can decrypt the file.
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


        readStream.on('error', ()=>{error_callback('ReadStream error')});
        readStream.on('end', ()=>{done_callback(file)});
    });

}

//decrypt({file:path.resolve('D:\\downloads\\XD_Set-Up.exe.dnc'), password:'123'}, (err)=>{console.log('{!} Error : ' + err)}, (filename)=>{console.log('{*} Done : ' + filename)})
module.exports = decrypt;