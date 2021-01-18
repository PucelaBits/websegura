const fs = require("fs");

(function updateWebsiteMetadata() {
  fs.copyFileSync('sites.json', '_data/results/meta.json');
})();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addFilter("color", (value) => {
    if (value < 50) {
      return "#c60c0c45";
    }
    // TODO complete with all values available in Mozilla Observatory
    //      and use "grade" (A, B, etc) instead of the numeric "score".
    return "inherit";
  });

  eleventyConfig.addFilter("urlEncode", (value) => {
    return encodeURIComponent(value);
  });
};
