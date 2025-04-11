/**
 * Solicita los resultados (estado actual + histórico) de los sitios web dados de alta en el proyecto.
 * El análisis se hace utilizando el API de Mozilla.
 *
 * Más información en:
 * https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md
 */
const fs = require("fs/promises");
const axios = require("axios");
const Bottleneck = require("bottleneck");
const parser = require("./sites-parser");

const MOZILLA_API_BASE_URL = "https://observatory-api.mdn.mozilla.net/api/v2";
const MAX_CONCURRENT_REQUESTS = 20;

function convertToLegacyTimestamp(isoTimestamp) {
  const date = new Date(isoTimestamp);
  const gmtString = date.toUTCString();
  const unixTimestamp = Math.floor(date.getTime() / 1000);
  return {
    end_time: gmtString,
    end_time_unix_timestamp: unixTimestamp
  };
}

// TODO use the limiter (see analyze.js)
const limiter = new Bottleneck({ maxConcurrent: MAX_CONCURRENT_REQUESTS });

async function results() {
  const sites = await parser.parse();

  for (const site of sites) {
    const fileName = site.replace(/\./g, "!") + ".json";
    try {
      console.log(`Request ${site} scan results`);
      const result = await axios.get(
        `${MOZILLA_API_BASE_URL}/analyze?host=${site}`
      );

      await fs.writeFile(
        `_data/results/${fileName}`,
        JSON.stringify(result.data.scan, null, 2)
      );

      // Convert v2 format to legacy v1 format to maintain compatibility
      // In the future we should use the v2 format for both results and history,
      // code would be simpler.
      const history = result.data.history.map((h) => {
        const timestamps = convertToLegacyTimestamp(h.scanned_at);
        return {
          end_time: timestamps.end_time,
          end_time_unix_timestamp: timestamps.end_time_unix_timestamp,
          grade: h.grade,
          score: h.score,
          // scan_id is not present in v2 and not used in websegura
        };
      });

      await fs.writeFile(
        `_data/history/${fileName}`,
        JSON.stringify(history, null, 2)
      );
    } catch (e) {
      if (e.response) {
        console.error(
          `Failed (${e.response.status}): ${e.response.statusText}`
        );
      } else {
        console.error(e);
      }
    }
  }
}

results().catch((err) => {
  console.error(err);
  process.exit(1);
});
