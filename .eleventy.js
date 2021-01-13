module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("web/assets");
  eleventyConfig.addPassthroughCopy("web/images");
  eleventyConfig.addPassthroughCopy({ output: "_data/results" });

  return {
    dir: {
      data: "../_site/_data",
    },
  };
};
