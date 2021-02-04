/**
 * Solicita el inicio del análisis de los sitios web dados de alta en el proyecto.
 * El análisis se hace utilizando el API de Mozilla. Mozilla encola la petición y
 * tarda un rato en hacer un análisis, por lo que la consulta del resultado se hace
 * en otra fase (ver crawler/results.js)
 *
 * Más información en:
 * https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md
 */
const axios = require('axios');
const Bottleneck = require('bottleneck');
const parser = require('./sites-parser');

const MOZILLA_API_BASE_URL = 'https://http-observatory.security.mozilla.org/api/v1';
const MAX_CONCURRENT_REQUESTS = 20;

const limiter = new Bottleneck({maxConcurrent: MAX_CONCURRENT_REQUESTS});

async function analyze() {
  const sites = await parser.parse();

  const promises = sites.map((site, i) => limiter.schedule(() => {
    console.log(`${i} Scanning ${site} using Mozilla HTTP Observatory API`);
    return axios.post(`${MOZILLA_API_BASE_URL}/analyze?host=${site}&rescan=true`);
  }));

  await Promise.all(promises);
}

analyze().catch(err => {
  console.error(err);
  process.exit(1);
});
