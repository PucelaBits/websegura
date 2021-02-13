const glob = require("fast-glob");
const fs = require("fs");

// Valor arbitrariamente alto para marcar webs con resultados pendientes
// y que aparezcan al final al ordenar de menos a más seguro.
const NO_SCORE = 9000;

(function createGlobalDataFile() {
  const files = glob.sync([
    "_data/{comunidades,provincias}/*.json",
    "_data/general.json",
  ]);
  let all = files
    .map((f) => ({
      file: JSON.parse(fs.readFileSync(f, "utf8")),
      territorio_id: /^_data.*\/(.*)\.json$/.exec(f)[1],
    }))
    .map(({ file, territorio_id }) => ({
      territorio_id,
      territorio: file.name,
      webs: file.webs,
    }))
    .map(({ territorio_id, territorio, webs }) =>
      webs.map((web) => ({
        territorio_id,
        territorio,
        url: web.url,
        name: web.name,
        twitter: web.twitter,
        tags: web.tags
      }))
    )
    .flat()
    .map((obj) => {
      let results;
      try {
        results = JSON.parse(
          fs.readFileSync(
            `_data/results/${obj.url.replace(new RegExp("\\.", "g"), "!")}.json`,
            "utf8"
          )
        );
      } catch (e) {
        // Los resultados aún no están disponibles.
      }
      return {
        ...obj,
        results,
      };
    })
    .map((obj) => ({
      ...obj,
      grade: obj.results?.grade,
      score: obj.results?.score ?? NO_SCORE,
      tests_passed: obj.results?.tests_passed,
      state: obj.results?.state,
    }));

  fs.writeFileSync("_data/all.json", JSON.stringify(all));
})();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addFilter("color", (security) => {
    if (security.tests_passed < 5) {
      return "danger";
    }

    switch (security && security.grade && security.grade[0]) {
      case "A":
      case "B":
        return "safe";
      case "C":
      case "D":
        return "moderate";
      case "E":
      case "F":
        return "severe";
      default:
        return "unknown";
    }
  });

  eleventyConfig.addFilter("abbr", (security) => {
    let abbr = "";
    switch (security && security.grade && security.grade[0]) {
      case "A":
        abbr = "El sitio es muy seguro.";
        break;
      case "B":
        abbr = "El sitio es seguro.";
        break;
      case "C":
        abbr = "El sitio podría mejorar su seguridad.";
        break;
      case "D":
        abbr = "El sitio debería mejorar su seguridad.";
        break;
      case "E":
        abbr = "El sitio es inseguro.";
        break;
      case "F":
        abbr = "El sitio es muy inseguro.";
        break;
      default:
        return "Desconocido.";
    }

    abbr += ` Pasó ${security.tests_passed} de las ${security.tests_quantity} comprobaciones realizadas`;
    return abbr;
  });

  eleventyConfig.addFilter("urlEncode", (value) => encodeURIComponent(value));

  eleventyConfig.addFilter("testsPassedLt", (value, testsPassed) =>
    value.filter((v) => v.tests_passed < testsPassed)
  );

  eleventyConfig.addFilter(
    "scoreGt", (value, score) => value.filter((v) => v.score > score && v.score < NO_SCORE)
  );

  eleventyConfig.addFilter(
    "tagged", (value, tag) => value.filter((v) => {
      return v.tags && v.tags.indexOf(tag.name) >= 0;
    })
  );

  // Devolvemos el safeScore, o % de webs seguras
  eleventyConfig.addFilter(
    "safeScore",
    (value) => {
        let safe = value.filter((v) => v.score > 69 && v.score < NO_SCORE).length
        let safeScore = (safe * 100)/value.length
        return safeScore.toFixed(0);
    }
  );

  eleventyConfig.addFilter("filterByTerritorioId", (value, territorio_id) =>
    value.filter((v) => v.territorio_id === territorio_id)
  );
};
