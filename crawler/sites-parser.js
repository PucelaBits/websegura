/**
 * Fichero con utilidades comunes al crawling, para procesar los ficheros de entrada
 * gloal, de comunidades y de provincias.
 */
const fs = require('fs');
const glob = require('fast-glob');

const MAX_TIME_TO_REFRESH_MILLIS = 3 * 24 * 60 * 60 * 1000; // 3 days, can be increased when we have many sites to scan

/**
 * Obtiene los ficheros global, de comunidades y provincias.
 */
function getAllUrls() {
  const files = glob.sync('_data/{comunidades,provincias}/*.json');
  files.push('_data/general.json')
  return files
    .flatMap(file => JSON.parse(fs.readFileSync(file)).webs.map(x => beautify(x.url)))
}

/**
 * Devuelve la URL de las webs que no se han refrescado
 * en los últimos MAX_TIME_TO_REFRESH_MILLIS.
 *
 * For the sake of simplicity, this function is sync for now
 */
async function parse() {
  return getAllUrls().filter(outdated);
}

// Mozilla espera un hostname (sin / final y sin indicar protocolo "http[s]://")
function beautify(url) {
  url = url.replace('http://', '');
  url = url.replace('https://', '');
  return new URL(`https://${url}`).hostname;
}

function outdated(site) {
  const fileName = site.replace(/\./g, '!') + '.json';
  const path = `_data/results/${fileName}`;

  try {
    const siteInfo = JSON.parse(fs.readFileSync(path));
    const recent = new Date(siteInfo.start_time).valueOf() > Date.now() - MAX_TIME_TO_REFRESH_MILLIS;
    if (siteInfo.state === 'FINISHED' && recent) {
      console.log(`Skip ${site} because it was recently scanned`);
      return false;
    }
  } catch (err) {
    // file not found (err.code === ENOENT) or an unexpected error, refresh the analysis
  }

  return true;
}

module.exports = {
  parse: parse,
  beautify: beautify,
  getAllUrls: getAllUrls,
}
