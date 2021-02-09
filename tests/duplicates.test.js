const test = require('ava');
const { getAllUrls } = require('../crawler/sites-parser')
const findDuplicates = require('array-find-duplicates');

test.serial('verify duplicates', (t) => {
  const urls = getAllUrls();
  const duplicates = findDuplicates(urls);
  if (duplicates.length > 0) {
    return t.fail("Found duplicated URLs: " + duplicates.join(", "));
  } else {
    return t.pass()
  }
});
