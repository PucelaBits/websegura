const fs = require('fs/promises');
const axios = require('axios');

const MOZILLA_API_BASE_URL = 'https://http-observatory.security.mozilla.org/api/v1';

const parser = require('./sites-parser');

// TODO use bottleneck to batch/parallelize requests to Mozilla API
// const bottleneck = require('bottleneck');
// const limiter = new Bottleneck({
//   maxConcurrent: 10
// });

const MAX_TIME_TO_REFRESH_MILLIS = 2 * 24 * 60 * 60 * 1000; // 2 days, can be increased when we have many sites to scan

async function analyze() {
  const sites = parser.parse();

  for (const site of sites) {
    const fileName = site.replace(/\./g, '!') + '.json';
    const path = `_data/results/${fileName}`;

    let refresh = true; // see https://github.com/PucelaBits/websegura/issues/34#issuecomment-772668968
    try {
      const siteInfo = JSON.parse(await fs.readFile(path));
      const recent = new Date(siteInfo.start_time).valueOf() > Date.now() - MAX_TIME_TO_REFRESH_MILLIS;
      if (siteInfo.state === 'FINISHED' && recent) {
        console.log(`Skip ${site} because it was recently scanned`);
        refresh = false;
      }
    } catch (err) {
      // file not found (err.code === ENOENT) or an unexpected error, refresh the analysis
    }

    if (refresh) {
      // see https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md
      console.log(`Scanning ${site} using Mozilla HTTP Observatory API`);
      await axios.post(`${MOZILLA_API_BASE_URL}/analyze?host=${site}&rescan=true`);
    }
  }
}

analyze()
  .then(x => console.log('OK'))
  .catch(err => console.error(err));
