#!/usr/bin/env bash

SITES=`cat sites.csv | cut -d ',' -f 1`
for site in $SITES; do
  # see https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md
  echo "Scanning $site using Mozilla HTTP Observatory API"
  curl -s -X POST "https://http-observatory.security.mozilla.org/api/v1/analyze?host=$site&rescan=true"
done

sleep 60
rm _data/results/*.json

for site in $SITES; do
  echo "Requesting $site scan results"
  curl -s -X GET "https://http-observatory.security.mozilla.org/api/v1/analyze?host=$site" > _data/results/${site//./!}.json
done
