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
 * en los últimos MAX_TIME_TO_REFRESH_MILLIS.
 * Para evitar saturar el API de Mozilla se devuelve MAX_RESULTS como máximo, ordenados al azar.
 *
 * For the sake of simplicity, this function is sync for now
 */
async function parse(limit = MAX_RESULTS) {
  const all = getAllUrls().filter(outdated).slice(0, limit);
}

// Mozilla espera un hostname (sin / final y sin indicar protocolo "http[s]://")
function beautify(url) {
  url = url.replace("http://", "");
  url = url.replace("https://", "");
  return new URL(`https://${url}`).hostname;
}

function outdated(site) {
  const fileName = site.replace(/\./g, "!") + ".json";
  const path = `_data/results/${fileName}`;

  try {
    // TODO remove these console logs, they are only here to help us debug an issue
    console.log(`Check ${path}`);
    const siteInfo = JSON.parse(fs.readFileSync(path));
    const recent =
      new Date(siteInfo.start_time).valueOf() >
      Date.now() - MAX_TIME_TO_REFRESH_MILLIS;
    console.log('\tstate = ' + siteInfo.state);
    console.log('\tis recent = ' + recent + ' ' + siteInfo.start_time);
    if (siteInfo.state === "FINISHED" && recent) {
      console.log('\tNo need to analyze it');
      return false;
    }
  } catch (err) {
    console.log('\tERROR', err);
    // file not found (err.code === ENOENT) or an unexpected error, refresh the analysis
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
