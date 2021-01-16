const csvParse = require("csv-parse/lib/sync");
const fs = require("fs");

(function updateWebsiteMetadata() {
  const records = csvParse(fs.readFileSync("sites.csv", "utf8"));
  fs.writeFileSync(
    "_data/results/meta.json",
    JSON.stringify(
      records.map((record) => ({
        url: record[0],
        name: record[1],
        twitter: record[2],
      }))
    )
  );
})();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addNunjucksFilter("color", function (value) {
    if (value < 50) {
      return "#c60c0c45";
    }
    // TODO complete with all values available in Mozilla Observatory
    //      and use "grade" (A, B, etc) instead of the numeric "score".
    return "inherit";
  });

  eleventyConfig.addFilter("urlEncode", function (value) {
    return encodeURIComponent(value);
  });
};
