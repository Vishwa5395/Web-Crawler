function sortPages(pages) {
  const pagesArr = Object.entries(pages);
  pagesArr.sort((a, b) => b[1] - a[1]);
  return pagesArr;
}

function printReport(pages) {
  console.log("------------");
  console.log("FINAL REPORT");
  console.log("------------");
  const sorted = sortPages(pages);
  for (const [url, hits] of sorted) {
    console.log(`URL: ${url} , Hits: ${hits}`);
  }
  console.log("------------");
}

module.exports = { sortPages, printReport };
