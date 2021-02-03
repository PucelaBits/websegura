const fs = require('fs');
const glob = require('fast-glob');

// For the sake of simplicity, this function is sync for now
function parse() {
  const files = glob.sync(['_data/{comunidades,provincias}/*.json', '_data/general.json']);
  return files.flatMap(file => JSON.parse(fs.readFileSync(file)).webs.map(x => beautify(x.url)));
}

function beautify(url) {
  url = url.replace('http://', '');
  url = url.replace('https://', '');
  return new URL(`https://${url}`).hostname;
}

module.exports = {
  parse: parse
}
