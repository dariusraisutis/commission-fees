const main = require('./main/Main');


let filePath = process.argv.slice(2);
main.run(filePath[0])
    .then((result) => {
        if (result) {
            result.map(commissionFee => console.log(commissionFee));
        }
    })
    .catch((error) => {
        console.log(error);
    });


