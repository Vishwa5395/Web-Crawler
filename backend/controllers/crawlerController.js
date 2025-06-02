const { crawlPage } = require('../services/crawler.js');
const { sortPages } = require('../services/report.js');
const Url = require('../models/urlModel.js');
const { setCancelFlag } = require('../services/crawler');


exports.crawlAndSave = async (req, res) => {
  const { baseURL } = req.body;
  if (!baseURL) return res.status(400).json({ error: 'baseURL is required' });

  setCancelFlag(false);

  const pages = await crawlPage(baseURL, baseURL, {});
  console.log("Crawled Pages:", pages);
  

  const links = Object.entries(pages).map(([url, hits]) => ({
    url,
    hits,
    status: 200
  }));

  const totalHits = links.reduce((sum, l) => sum + l.hits, 0);

  const crawlData = {
    baseURL,
    timestamp: new Date().toISOString(),
    totalHits,
    totalLinks: links.length,
    links
  };

  // Store OR update crawl session in MongoDB (per baseURL)
  await Url.findOneAndUpdate(
    { baseURL },
    crawlData,
    { upsert: true, new: true }
  );


  return res.status(200).json({ message: 'Crawling complete', crawled: pages });
};

exports.stopCrawl = (req, res) => {
  setCancelFlag(true);
  res.status(200).json({ message: "Crawl has been stopped." });
};

exports.deleteAllHistory = async (req, res) => {
  try {
    await Url.deleteMany({});
    res.status(200).json({ message: "All crawl history deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete crawl history." });
  }
};

exports.getReport = async (req, res) => {
  const all = await Url.find().sort({ timestamp: -1 });
  res.status(200).json(all);
};

