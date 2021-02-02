#!/usr/bin/env bash

for jsons in _data/general.json; do
if [ -f "$jsons" ]; then
    SITES_PR=`cat ${jsons} | jq -r .webs[].url`
    SITES="${SITES}
${SITES_PR}"
fi
done

for jsons in _data/provincias/*.json; do
if [ -f "$jsons" ]; then
    SITES_PR=`cat ${jsons} | jq -r .webs[].url`
    SITES="${SITES}
${SITES_PR}"
fi
done

for jsons in _data/comunidades/*.json; do
if [ -f "$jsons" ]; then
    SITES_PR=`cat ${jsons} | jq -r .webs[].url`
    SITES="${SITES}
${SITES_PR}"
fi
done

for site in $SITES; do
  # see https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md
  echo "Scanning $site using Mozilla HTTP Observatory API"
  curl -s -X POST "https://http-observatory.security.mozilla.org/api/v1/analyze?host=$site&rescan=true"
done

sleep 60  # XXX polling until mozilla finishes scanning the site might be more elegant
rm _data/results/*.json
rm _data/results/history/*.json

for site in $SITES; do
  echo "Requesting $site scan history"
  curl -s -X GET "https://http-observatory.security.mozilla.org/api/v1/getHostHistory?host=$site" | jq . > _data/results/history/${site//./!}.json
  echo "Requesting $site scan results"
  curl -s -X GET "https://http-observatory.security.mozilla.org/api/v1/analyze?host=$site" | jq . > _data/results/${site//./!}.json
done
