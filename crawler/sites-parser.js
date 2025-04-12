/**
 * Fichero con utilidades comunes al crawling, para procesar los ficheros de entrada
 * gloal, de comunidades y de provincias.
 */
const fs = require("fs");
const glob = require("fast-glob");

const MAX_DAYS_TO_REFRESH = process.env.CRAWLER_MAX_DAYS_TO_REFRESH || 2; // can be increased when we have many sites to scan
const MAX_TIME_TO_REFRESH_MILLIS = MAX_DAYS_TO_REFRESH * 24 * 60 * 60 * 1000;
const MAX_RESULTS = process.env.CRAWLER_MAX_RESULTS || 400;

/**
 * Obtiene las rutas a los ficheros global, de comunidades y provincias.
 */
function getAllFiles() {
  const files = glob.sync("_data/{comunidades,provincias}/*.json");
  files.push("_data/general.json");
  return files;
}

function pathToObject(path) {
  return JSON.parse(fs.readFileSync(path));
}

/**
 * Obtiene todas las urls especificadas en los ficheros global, de comunidades y provincias.
 */
function getAllUrls() {
  const files = getAllFiles();
  return files.flatMap((file) =>
    pathToObject(file).webs.map((x) => beautify(x.url))
  );
}

/**
 * Devuelve la URL de las webs que no se han refrescado
 * en los últimos `MAX_TIME_TO_REFRESH_MILLIS`.
 * Para evitar saturar el API de Mozilla se devuelve `MAX_RESULTS` como máximo.
 *
 * For the sake of simplicity, this function is sync for now
 */
async function parse(limit = MAX_RESULTS) {
  const allUrls = getAllUrls()
  const outdatedUrls = allUrls.filter(outdated)
  const all = outdatedUrls
    .sort((a, b) => {
      const aInfo = siteInfo(a);
      const bInfo = siteInfo(b);

      // Sorting oldest pages first guarantee they have a chance
      // to be processed in the next run.
      if (aInfo && bInfo) {
        const aStartTime = new Date(aInfo.start_time).valueOf();
        const bStartTime = new Date(bInfo.start_time).valueOf();
        return aStartTime - bStartTime;
      } else if (aInfo) {
        return 1;
      } else if (bInfo) {
        return -1;
      } else {
        return 0;
      }
    })
    .slice(0, limit);

  console.log(`Total sites: ${allUrls.length}. Outdated sites: ${all.length}. Reported sites: ${all.length} (limit = ${limit})`);
  return all;
}

// Mozilla espera un hostname (sin / final y sin indicar protocolo "http[s]://")
function beautify(url) {
  url = url.replace("http://", "");
  url = url.replace("https://", "");
  return new URL(`https://${url}`).hostname;
}

function filePath(site) {
  const fileName = site.replace(/\./g, "!") + ".json";
  return`_data/results/${fileName}`;
}

const siteInfoCache = {}

function siteInfo(site) {
  if (siteInfoCache[site] !== undefined) {
    return siteInfoCache[site]
  }

  try {
    const path = filePath(site);
    const result = JSON.parse(fs.readFileSync(path));
    siteInfoCache[site] = result
    return result
  } catch (err) {
    console.log('\tWARN', err.message);
    // file not found (err.code === ENOENT) or an unexpected error, refresh the analysis
  }
}

function outdated(site) {
  // XXX remove these console logs, they are only here to help us debug an issue
  console.log(`Check ${site}`);

  const info = siteInfo(site);
  if (info) {
    const recent =
      new Date(info.start_time).valueOf() >
      Date.now() - MAX_TIME_TO_REFRESH_MILLIS;

    if (recent) {
      console.log('\tRecent result. No need to analyze it');
      return false;
    }
  }

  return true;
}

module.exports = {
  parse: parse,
  beautify: beautify,
  getAllUrls: getAllUrls,
  getAllFiles: getAllFiles,
  pathToObject: pathToObject,
};
