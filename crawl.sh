#!/usr/bin/env bash

SITES_VA=`cat _data/provincias/valladolid.json | jq -r .webs[].url`
SITES_CYL=`cat _data/comunidades/castilla-y-leon.json | jq -r .webs[].url`
SITES="${SITES_VA}\n${SITES_CYL}"
echo "$SITES";
for site in $SITES; do
  # see https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md
  echo "Scanning $site using Mozilla HTTP Observatory API"
  curl -s -X POST "https://http-observatory.security.mozilla.org/api/v1/analyze?host=$site&rescan=true"
done

sleep 60  # XXX polling until mozilla finishes scanning the site might be more elegant
rm _data/results/*.json

for site in $SITES; do
  echo "Requesting $site scan results"
  curl -s -X GET "https://http-observatory.security.mozilla.org/api/v1/analyze?host=$site" | jq . > _data/results/${site//./!}.json
done
