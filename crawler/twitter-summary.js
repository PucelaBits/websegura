const fs = require("fs");
const glob = require("fast-glob");

const PUCELABITS_TWITTER_USERNAME = "PucelaBits";

function getTwitterHistoryFiles() {
  return glob.sync("_data/twitter/history/*.json");
}

/**
 * Recorre los ficheros del histórico de Twitter para devolver
 * un mapa de correspondencias entre sitio -> {total_tweets: x}.
 */
async function summarize() {
  console.log("Building Twitter summary");
  const summary = getTwitterHistoryFiles()
    .map(file => JSON.parse(fs.readFileSync(file)))
    .flatMap(toUsernames)
    .filter(x => !!x)
    .reduce(countDuplicates, {});

  console.log(summary);
  fs.writeFileSync('_data/twitter/summary.json', JSON.stringify(summary, null, 2));
}

/**
 * Filtra los tweets validos y devuelve un array donde cada elemento es el nombre de
 * usuario de Twitter referenciado. Si hay varios, se queda con el primero que encuentra.
 */
function toUsernames(dailyTwitterResults) {
  return dailyTwitterResults
    .data?.filter(containsValidReference)
    .map(tweet => tweet.entities.mentions.find(x => x.username !== PUCELABITS_TWITTER_USERNAME).username)
}

// https://stackoverflow.com/a/43530199/12388
function countDuplicates(obj, num) {
  obj[num] = (++obj[num] || 1);
  return obj;
}

/**
 * Determina si un tweet tiene una referencia válida a websegura y forma
 * parte de la campaña de difusión de la web. Así no se tienen en cuenta
 * apariciones del hashtag "websegura" en otros contextos.
 */
function containsValidReference(tweet) {
  const valid =
    tweet.entities.hashtags?.some(x => x.tag === "websegura") &&
    tweet.entities.mentions?.some(x => x.username.toLowerCase() === PUCELABITS_TWITTER_USERNAME.toLowerCase()) &&
    tweet.entities.urls?.some(x => x.expanded_url.indexOf("HazseloSaber") >= 0);

  return valid;
}

summarize().catch(err => {
  console.error(err);
  process.exit(1);
});