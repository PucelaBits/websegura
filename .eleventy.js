const fs = require("fs");

(function updateWebsiteMetadata() {
  fs.copyFileSync('sites.json', '_data/results/meta.json');
})();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addFilter("color", (security) => {
    switch (security.grade[0]) {
      case 'A':
      case 'B':
        return "#3fad4645";
      case 'C':
      case 'D':
        return "#f0ad4e45"
      case 'E':
      case 'F':
        return "#d9534f45"
      default:
        return "inherit";
    }
  });

  eleventyConfig.addFilter("abbr", (security) => {
    let abbr = "";
    switch (security.grade[0]) {
      case 'A':
        abbr = "El sitio es muy seguro.";
        break;
      case 'B':
        abbr = "El sitio es seguro.";
        break;
      case 'C':
        abbr = "El sitio podría mejorar su seguridad."
        break;
      case 'D':
        abbr = "El sitio debería mejorar su seguridad."
        break;
      case 'E':
        abbr = "El sitio es inseguro."
        break;
      case 'F':
        abbr = "El sitio es muy inseguro."
        break;
      default:
        abbr = "Desconocido.";
        break;
    }

    abbr += ` Pasaron ${security.tests_passed} de las ${security.tests_quantity} comprobaciones realizadas`;
    return abbr;
  });

  eleventyConfig.addFilter("urlEncode", (value) => {
    return encodeURIComponent(value);
  });
};
