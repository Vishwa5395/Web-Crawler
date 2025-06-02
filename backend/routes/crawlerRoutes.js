const express = require('express');
const router = express.Router();
const { crawlAndSave, getReport, stopCrawl } = require('../controllers/crawlerController');
const { deleteAllHistory } = require('../controllers/crawlerController');

 // 👈 NEW

router.post('/crawl', crawlAndSave);
router.get('/report', getReport);
router.post('/cancel', stopCrawl);
router.delete('/history', deleteAllHistory);

module.exports = router;
