var axios = require("axios");

async function getData(url) {
    return new Promise(async (resolve, reject) => {
        console.log("INSIDE LIB GETMARKETOBJ : :", url);

        // var url = "https://financialmodelingprep.com/api/v3/quote/" + symbol + "?apikey=" + process.env.FMP_KEY


        var options = {
            method: 'GET',
            preambleCRLF: true,
            postambleCRLF: true,
            url: url
        };

        await axios(options).then((resp) => {
            // console.log("RESP: : : ", resp['data']);
            resolve(resp['data'])
        }).catch(err => {
            console.log("ERROR IN GET MARKET INFO : : LIB");
        });
    });
};

module.exports = getData;