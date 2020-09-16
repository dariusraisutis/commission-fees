import run from '../src/main/Main';

(async () => {
        try {
        const filePath = process.argv.slice(2);
        const result = await run(filePath[0]);
        result.map(commissionFee => console.log(commissionFee));
        } catch (error) {
                console.log(error);
        }
})()