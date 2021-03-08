const puppeteer = require("puppeteer");

const getIdCategory = (storeName, value) => {
    if (storeName == "shopee") {
        const id = value != undefined ? value.split(".") : ['', 0];
        const result = id[1] != undefined ? parseInt(id[1]) : 0; 
        return result
    } else {
        return 0
    }
};

const getIdProduct = (storeName, value) => {
    if (storeName == "sendo" || storeName == "tiki") {
        const str = value != undefined ? value.split(".") : ['', ''];
        const result = str[0].substring(str[0].length - 8); 
        return result
    } else if(storeName == "lazada"){
      const str = value != undefined ? value.split(".") : ['', ''];
      const result = str[2].substring(str[2].length - 10); 
      return result
    } else{
      return config.crawler.defaultName
    }
  };

const getPageContent = async (url) => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 })
        await page.goto(url, { waitUntil: 'networkidle2' });
        await autoScroll(page);
        return await page.content();
    } catch (err) {
        console.error(err);
    }
};

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}

module.exports = {
    getIdCategory,
    getIdProduct,
    getPageContent,
    autoScroll
}