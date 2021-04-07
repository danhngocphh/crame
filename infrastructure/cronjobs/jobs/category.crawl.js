const storeId = "601974473bb314a8f475e723";
const logger = require('../../logger');
const common = require("../../services/crawl/common");
const { store: StoreModel, rootcategory: rootCategoryModel } = require('../../database/models');



module.exports = function (agenda) {
    agenda.define("crawlCategory",async () => {
        const browserInstance = await common.launchBrowserInstance();
        logger.info(`Start crawling category: Store(` + storeId + `)`);
        const store = await StoreModel.findOne({ _id: storeId });
        if (!store) {
            reject(new APIError(config.crawler.nullStore, config.httpStatus.BadRequest));
        }
        const page = await browserInstance.newPage();
        await page.goto(`${store.baseUrl}${store.dataCrawlCategory.categoryPath}`, { waitUntil: 'load', timeout: 0 });
        const categories = [];
        await Promise.all(
            store.dataCrawlCategory.steps.map(async (step) => {
                const result = await page.$$eval(step.selector, (ele) => {
                    return ele.map((a) => {
                        return {
                            name: a.textContent.trim() || config.crawler.defaultName,
                            url: a.href || config.crawler.defaultName,
                        };
                    });
                });
                categories.push(result);
                console.log(result);
            })
        );
        await page.close();
        console.log(categories);
        logger.info(`Crawl category done: Store(` + storeId + `)`);

    });
};