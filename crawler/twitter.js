const Twitter = require('twitter-lite');
const fs = require('fs/promises');

if (!process.env.TWITTER_BEARER_TOKEN) {
  console.error("Required environment variable not set TWITTER_BEARER_TOKEN");
  process.exit(1);
}

async function results(daysAgo) {
  const client = new Twitter({
    version: "2",
    extension: false, // must be set to false for v2 endpoints
    bearer_token: process.env.TWITTER_BEARER_TOKEN
  });

  // TODO I'm getting 2021-03-05T23:00:00.000Z instead of 2021-03-06T00:00:00.000Z
  //      I hate time zones. This needs to be fixed.
  const midnight = new Date();
  midnight.setUTCHours(0,0,0,0);

  const end = new Date(midnight - 1000 * 60 * 60 * daysAgo);
  const start = new Date(end - 1000 * 60 * 60 * 24);

  try {
    console.log(`Request Twitter info from ${start.toISOString()} to ${end.toISOString()}`);

    // Twitter API reference
    // see https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference

    // XXX This code assumes we won't have more than 100 tweets with hashtag #websegura per day.
    //     We need to improve this code adding pagination when needed.
    const tweets = await client.get("tweets/search/recent", {
      "query": "#websegura",
      "max_results": 100, // max = 100
      "tweet.fields": "entities",
      "start_time": start.toISOString(),
      "end_time": end.toISOString()
    });

    // useful for debugging purposes only
    // console.log(JSON.stringify(tweets, null, 2));

    dumpRateLimitInfo(tweets);

    const fileName = yesterdayStart.toISOString();
    await fs.writeFile(`_data/twitter/history/${fileName}`, JSON.stringify(tweets, null, 2));
  } catch (e) {
    console.error('Not able to retrieve and store Twitter API results', e);
  }
}

function dumpRateLimitInfo(response) {
  console.log(`Rate: ${response._headers.get('x-rate-limit-remaining')} / ${response._headers.get('x-rate-limit-limit')}`);
  const delta = (response._headers.get('x-rate-limit-reset') * 1000) - Date.now()
  console.log(`Reset: ${Math.ceil(delta / 1000 / 60)} minutes`);
}

const HOW_MANY_DAYS_AGO = process.env.HOW_MANY_DAYS_AGO || 1;

results(HOW_MANY_DAYS_AGO).catch(err => {
  console.error(err);
  process.exit(1);
});
