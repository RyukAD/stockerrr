var getData = require(__dirname + "/../../lib/makeRequest");

async function getPrice(symbol) {

    console.log("INSIDE LIB GET PRICE : : ");

    var url = "https://financialmodelingprep.com/api/v3/quote/" + symbol + "?apikey=" + process.env.FMP_KEY;

    let marketObj = await getData(url);

    return marketObj;

};

module.exports = getPrice;