const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

module.exports = async (unit, currency) => {
  console.log(unit, currency);

  const getPricesTable = async (unit) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://goldpricez.com/us/${unit}`, {
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

    console.log(goldPricesInUsd);
    return goldPricesInUsd;
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

    getGoldPricesInUsd(pureTableValues);
  };

  const pageBody = await getPricesTable("gram");

  parsePricesHtmlCode(pageBody);
};
