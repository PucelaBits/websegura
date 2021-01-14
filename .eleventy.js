module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("web/assets");
  eleventyConfig.addPassthroughCopy("web/images");
};
