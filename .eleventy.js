const fs = require("fs");

(function updateWebsiteMetadata() {
  fs.copyFileSync('sites.json', '_data/results/meta.json');
})();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addFilter("color", (grade) => {
    if (!grade || grade === "") { // for those cases where crawling fails
      return "inherit";
    }

    switch (grade[0]) {
      case 'A':
      case 'B':
        return "#3fad4645";
      case 'C':
      case 'D':
        return "#f0ad4e45"
      case 'E':
      case 'F':
        return "#d9534f45"
      default: return "inherit";
    }
  });

  eleventyConfig.addFilter("urlEncode", (value) => {
    return encodeURIComponent(value);
  });
};
