const test = require('ava');
const { beautify } = require('../crawler/sites-parser')

test.serial('verify url beautifier', (t) => {
  t.is(beautify("pucelabits.org"), "pucelabits.org");
  t.is(beautify("www.pucelabits.org"), "www.pucelabits.org");
  t.is(beautify("http://pucelabits.org"), "pucelabits.org");
  t.is(beautify("https://www.pucelabits.org/"), "www.pucelabits.org");
  t.is(beautify("https://foo.bar.pucelabits.org/a/b"), "foo.bar.pucelabits.org");
});
