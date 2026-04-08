#!/usr/bin/env sh
# Cloudflare Pages build script.
# If RUNLOG_DATA_TOKEN and RUNLOG_DATA_REPO are set, clones the private data
# repo and copies its JSON files into src/data/ before building.
# Otherwise builds with the example data committed under src/data/example/.

set -e

if [ -n "$RUNLOG_DATA_TOKEN" ] && [ -n "$RUNLOG_DATA_REPO" ]; then
	echo "→ Fetching personal runlog data from $RUNLOG_DATA_REPO"
	rm -rf /tmp/runlog-data
	git clone --depth 1 \
		"https://oauth2:${RUNLOG_DATA_TOKEN}@github.com/${RUNLOG_DATA_REPO}.git" \
		/tmp/runlog-data
	if ls /tmp/runlog-data/*.json >/dev/null 2>&1; then
		cp /tmp/runlog-data/*.json src/data/
		count=$(ls /tmp/runlog-data/*.json | wc -l | tr -d ' ')
		echo "→ Copied $count runlog file(s) into src/data/"
	else
		echo "→ Data repo had no JSON files; falling back to example data"
	fi
else
	echo "→ RUNLOG_DATA_TOKEN/RUNLOG_DATA_REPO not set; building with example data"
fi

pnpm build
