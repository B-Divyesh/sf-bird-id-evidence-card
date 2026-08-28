#!/usr/bin/env bash
set -euo pipefail
url="${1:-http://127.0.0.1:4173/}"
html="$(curl -fsS "$url")"
grep -q '<html lang="en"' <<<"$html"
grep -q '<title>' <<<"$html"
grep -q '<main' <<<"$html"
grep -q 'alt="' <<<"$html"
echo "URL structure: pass ($url)"
