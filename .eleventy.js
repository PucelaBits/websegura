module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addNunjucksFilter("color", function(value) {
    if (value < 50) {
      return "#c60c0c45";
    }
    // TODO complete with all values available in Mozilla Observatory
    //      and use "grade" (A, B, etc) instead of the numeric "score".
    return "inherit";
  });
};
