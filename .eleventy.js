const fs = require("fs");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addFilter("color", (security) => {
    switch (security.grade[0]) {
      case 'A':
      case 'B':
        return "safe";
      case 'C':
      case 'D':
        return "moderate"
      case 'E':
      case 'F':
        return "severe"
      default:
        return "unknown";
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
        return "Desconocido.";
    }

    abbr += ` Pasaron ${security.tests_passed} de las ${security.tests_quantity} comprobaciones realizadas`;
    return abbr;
  });

  eleventyConfig.addFilter("urlEncode", (value) => {
    return encodeURIComponent(value);
  });
};
