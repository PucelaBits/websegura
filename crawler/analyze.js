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

const MOZILLA_API_BASE_URL = 'https://http-observatory.security.mozilla.org/api/v1';

const parser = require('./sites-parser');

// TODO use bottleneck to batch/parallelize requests to Mozilla API
// const bottleneck = require('bottleneck');
// const limiter = new Bottleneck({maxConcurrent: 10});

async function analyze() {
  const sites = await parser.parse();

  for (const site of sites) {
    console.log(`Scanning ${site} using Mozilla HTTP Observatory API`);
    await axios.post(`${MOZILLA_API_BASE_URL}/analyze?host=${site}&rescan=true`);
  }
}

analyze()
  .then(x => console.log('OK'))
  .catch(err => console.error(err));
