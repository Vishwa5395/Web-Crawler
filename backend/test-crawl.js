const { crawlPage } = require('./services/crawler.js');

(async () => {
  const baseURL = "https://youtube.com"; // or any other good test site
  const result = await crawlPage(baseURL, baseURL, {});
  console.log("Final pages:", result);
})();
