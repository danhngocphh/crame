const logger = require('../../infrastructure/logger');
const {
  launchBrowserInstance,
  autoScroll,
} = require('../../infrastructure/services/crawl/common');

const CrawlService = {
  scrapeCategory: async ({ url, selector }) => {
    const browserInstance = await launchBrowserInstance();
    const page = await browserInstance.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });
    const result = await page.$$eval(selector, (ele) => {
      return ele.map((a) => {
        return {
          link: a.href || 'Không có link',
          name: a.textContent.trim() || 'Không có name',
        };
      });
    });
    const pages = await browserInstance.pages();
    await Promise.all(pages.map((p) => p.close()));
    await browserInstance.close();
    return result;
  },
  scrapeProduct: async ({ url, selector, doAutoScroll }) => {
    const browserInstance = await launchBrowserInstance();
    const page = await browserInstance.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });
    if (doAutoScroll) await autoScroll(page);
    const result = await page.$$eval(selector, (ele) =>
      ele.map((a) => a.href || 'Không có link')
    );
    const pages = await browserInstance.pages();
    await Promise.all(pages.map((p) => p.close()));
    await browserInstance.close();
    return result;
  },
  scrapeDetailProduct: async ({
    url,
    selectorName,
    selectorPrice,
    selectorImage,
  }) => {
    const browserInstance = await launchBrowserInstance();
    const page = await browserInstance.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });
    let dataObj = {};
    dataObj['name'] =
      selectorName &&
      (await page.$eval(selectorName, (name) => name.textContent.trim()));
    dataObj['price'] =
      selectorPrice &&
      (await page.$eval(selectorPrice, (price) => price.textContent.trim()));
    dataObj['images'] =
      selectorImage &&
      (await page.$$eval(selectorImage, (imageUrls) =>
        imageUrls.map((imageUrl) =>
          imageUrl.tagName === 'IMG'
            ? imageUrl.src
            : imageUrl.style.backgroundImage.replace(
                /^url\(['"](.+)['"]\)/,
                '$1'
              )
        )
      ));
    const pages = await browserInstance.pages();
    await Promise.all(pages.map((p) => p.close()));
    await browserInstance.close();
    return dataObj;
  },
};

module.exports = CrawlService;
