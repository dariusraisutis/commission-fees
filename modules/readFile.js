const fs = require('fs');

const readFile = (filePath) =>{
    if(!filePath){
        throw new Error('Please provide file path!');
    }
    let transaction = [];
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if(err){
                reject(new Error(`Error occured when reading file. ${err.message}`));
            }   
            transaction = JSON.parse(data);   
            resolve(transaction);
        });
    });
}

module.exports = {
    readFile
}