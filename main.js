const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const ora = require("ora");

module.exports = async ({ unit = 21, size = "gram", currency = "egp" }) => {
  const spinner = ora().start();
  spinner.color = "yellow";
  spinner.text = "Getting Gold Price";

  const getPricesTable = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://goldpricez.com/us/${size}`, {
      waitUntil: "networkidle2",
    });

    const pricesTable = await page.$eval("#gold_price_table2", (pt) => {
      return pt.innerHTML;
    });

    await browser.close();
    return pricesTable;
  };

  const getGoldPricesInUsd = (pureTableValues) => {
    const goldPricesInUsd = {};
    let currentGoldK = "";
    pureTableValues.forEach((record, index) => {
      if (!(index % 2)) {
        currentGoldK = record.replace("K", "");
        if (currentGoldK) goldPricesInUsd[currentGoldK] = null;
      } else {
        if (currentGoldK)
          goldPricesInUsd[currentGoldK] = Number(record.replace("$", ""));
      }
    });

    return goldPricesInUsd[unit.toString()];
  };

  const parsePricesHtmlCode = (htmlCode) => {
    const $ = cheerio.load(htmlCode, {
      normalizeWhitespace: true,
    });

    const pureTableValues = $.html()
      .replace(/ /g, "")
      .replace("<html><head></head><body>KaratGoldPrice", "")
      .replace("</body></html>", "")
      .split("=")
      .flatMap((a) => a.split("USD"));

    return pureTableValues;
  };

  const convertFromUsd = async (userCurrency) => {
    const converterValue = await fetch(
      `https://free.currconv.com/api/v7/convert?q=USD_${userCurrency.toUpperCase()}&compact=ultra&apiKey=d021687a36d0c4af3c45`
    );
    const currencyValue = await converterValue.json();
    return Object.values(currencyValue)[0];
  };

  const pageBody = await getPricesTable();
  const pureTableValues = parsePricesHtmlCode(pageBody);
  const pricesInUsd = getGoldPricesInUsd(pureTableValues);
  const finalValue = await convertFromUsd(currency);
  const result = `${unit}K = ${
    finalValue * pricesInUsd
  } ${currency.toUpperCase()}`;
  spinner.succeed(result);
  return result;
};
