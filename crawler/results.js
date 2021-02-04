/**
 * Solicita los resultados (estado actual + histórico) de los sitios web dados de alta en el proyecto.
 * El análisis se hace utilizando el API de Mozilla.
 *
 * Más información en:
 * https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md
 */
const fs = require('fs/promises');
const axios = require('axios');
const Bottleneck = require('bottleneck');
const parser = require('./sites-parser');

const MOZILLA_API_BASE_URL = 'https://http-observatory.security.mozilla.org/api/v1';
const MAX_CONCURRENT_REQUESTS = 20;

// TODO use the limiter (see analyze)
const limiter = new Bottleneck({maxConcurrent: MAX_CONCURRENT_REQUESTS});

async function results() {
  const sites = await parser.parse();

  for (const site of sites) {
    const fileName = site.replace(/\./g, '!') + '.json';

    try {
      console.log(`Request ${site} scan history`);
      const history = await axios.get(`${MOZILLA_API_BASE_URL}/getHostHistory?host=${site}&rescan=true`);
      await fs.writeFile(`_data/results/history/${fileName}`, JSON.stringify(history.data, null, 2));
    } catch (e) {
      if (e.response) {
        console.error(`Failed request (${e.response.status}): ${e.response.statusText}`);
      } else {
        console.error(e);
      }
    }

    try {
      console.log(`Request ${site} scan results`);
      const result = await axios.get(`${MOZILLA_API_BASE_URL}/analyze?host=${site}`);
      if (result.data.state === 'FINISHED') {
        await fs.writeFile(`_data/results/${fileName}`, JSON.stringify(result.data, null, 2));
      }
    } catch (e) {
      if (e.response) {
        console.error(`Failed (${e.response.status}): ${e.response.statusText}`);
      } else {
        console.error(e);
      }
    }
  }
}

results().catch(err => {
  console.error(err);
  process.exit(1);
});
