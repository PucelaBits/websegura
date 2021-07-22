const glob = require("fast-glob");
const fs = require("fs");
const { pathToObject } = require("./crawler/sites-parser.js");

// Valor arbitrariamente alto para marcar webs con resultados pendientes
// y que aparezcan al final al ordenar de menos a más seguro.
const NO_SCORE = 9000;

// Fecha de lanzamiento de la plataforma en Unix timestamp.
const UNIX_TIME_RELEASE_DATE = 1611183600;

const getSafeScore = (value) => {
  let safe = value.filter((v) => v.score > 69 && v.score < NO_SCORE).length;
  let safeScore = (safe * 100) / value.length;
  return safeScore.toFixed(0);
};

const getEmailScore = (value) => {
  let safe = Object.values(value).filter((v) => v.spf.valid === true && v.dmarc.valid === true).length;
  let EmailScore = (safe * 100) / Object.values(value).length;
  return EmailScore.toFixed(0);
};

const filterByTerritorioId = (value, territorio_id) =>
  value.filter((v) => v.territorio_id === territorio_id);

const filenameToData = (f) => ({
  file: JSON.parse(fs.readFileSync(f, "utf8")),
  id: /^_data.*\/(.*)\.json$/.exec(f)[1],
});

(function createGlobalDataFile() {
  const territoriesLevel1 = glob.sync("_data/comunidades/*.json");
  const territoriesLevel2 = glob.sync("_data/provincias/*.json");

  const files = [
    ...territoriesLevel1,
    ...territoriesLevel2,
    "_data/general.json",
  ];

  const twitterSummary = JSON.parse(
    fs.readFileSync(`_data/twitter/summary.json`, "utf8")
  );

  const all = files
    .map(filenameToData)
    .map(({ file, id }) => ({
      territorio_id: id,
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
        twitter_mentions: twitterSummary[web.twitter] || 0,
        tags: web.tags,
      }))
    )
    .flat()
    .map((obj) => {
      let results;
      try {
        results = JSON.parse(
          fs.readFileSync(
            `_data/results/${obj.url.replace(
              new RegExp("\\.", "g"),
              "!"
            )}.json`,
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
      tests_failed: obj.results?.tests_failed,
      tests_quantity: obj.results?.tests_quantity,
      state: obj.results?.state,
    }));

  fs.writeFileSync("_data/all.json", JSON.stringify(all));

  const territories = territoriesLevel1
    .map(filenameToData)
    .map(({ file, id }) => ({
      name: file.name,
      id,
    }))
    .map(({ name, id }) => ({
      name,
      id,
      safeScore: getSafeScore(filterByTerritorioId(all, id)),
      subTerritories: territoriesLevel2
        .map(filenameToData)
        .filter(({ file }) => id === file.comunidad)
        .map(({ file, id }) => ({ id, ...file }))
        .map(({ name, id }) => ({
          name,
          id,
          safeScore: getSafeScore(filterByTerritorioId(all, id)),
        })),
    }));

  fs.writeFileSync("_data/territories.json", JSON.stringify(territories));
})();

(function createProgressFile() {
  const historyDir = "_data/results/history";
  let websWithProgress = glob
    .sync(historyDir + "/*.json")
    .map((path) => ({ path, file: pathToObject(path) }))
    .filter(({ file }) => Array.isArray(file))
    .map(({ path, file }) => ({
      path,
      file: file.filter(
        (check) => check.end_time_unix_timestamp > UNIX_TIME_RELEASE_DATE
      ),
    }))
    .filter(({ file }) => file.length >= 2)
    .map(({ path, file }) => ({
      file,
      path: path.substring(historyDir.length + 1),
    }));

  for (const { path, file } of websWithProgress) {
    fs.writeFileSync(`_data/results/progress/${path}`, JSON.stringify(file));
  }
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

  eleventyConfig.addFilter("scoreGt", (value, score) =>
    value.filter((v) => v.score > score && v.score < NO_SCORE)
  );

  eleventyConfig.addFilter("tagged", (value, tag) =>
    value.filter((v) => {
      return v.tags && v.tags.indexOf(tag.name) >= 0;
    })
  );

  // Filters values with DMARC and SPF with specific valid option (true or false)
  // Only values where SPF AND DMARC is valid, are considered valid
  // Values where SPF OR DMARC is not valid, are considered invalid
  // FIXME: For some reason the results.dmarc.summaty is an Object not and Array
  eleventyConfig.addFilter("isDmarcValid", (value, valid) => (valid) ?
    Object.values(value).filter((v) => v.spf.valid === valid && v.dmarc.valid === valid) : Object.values(value).filter((v) => v.spf.valid === valid || v.dmarc.valid === valid)
  );

  const dmarcSummary = JSON.parse(
    fs.readFileSync(`_data/results/dmarc/summary.json`, "utf8")
  );

  eleventyConfig.addFilter("dmarc_secure", (url) => {
    const dmarc_info = dmarcSummary[url];
    return dmarc_info.spf.valid === true && dmarc_info.dmarc.valid === true;
  });

  // % de webs seguras
  eleventyConfig.addFilter("safeScore", getSafeScore);
  // % de emails protegidos
  eleventyConfig.addFilter("emailScore", getEmailScore);

  eleventyConfig.addFilter("filterByTerritorioId", filterByTerritorioId);

  eleventyConfig.addFilter("getSubTerritories", (value) =>
    value.reduce(
      (previous, current) => [...previous, ...current.subTerritories],
      []
    )
  );
};
