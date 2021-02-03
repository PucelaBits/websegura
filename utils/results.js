const fs = require('fs/promises');
const axios = require('axios');

const MOZILLA_API_BASE_URL = 'https://http-observatory.security.mozilla.org/api/v1';

const parser = require('./sites-parser');

// TODO use bottleneck to batch/parallelize requests to Mozilla API
// TODO request outdated results only

async function results() {
  const sites = parser.parse();

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

results()
  .then(x => console.log('OK'))
  .catch(err => console.error(err));
