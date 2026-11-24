#!/bin/sh
# Build juarasilat-video.skill from an installed skill folder.
# The repo's assets/ tree is the source of truth for the shared library and is
# mirrored into the package as assets/shared/, so one unzip installs both.
# Usage: sh pack.sh [path-to-skill-folder]
# Default source: $HOME/.claude/skills/juarasilat-video
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
SRC=${1:-$HOME/.claude/skills/juarasilat-video}
[ -f "$SRC/SKILL.md" ] || { echo "no SKILL.md in $SRC"; exit 1; }
command -v zip >/dev/null || { echo "zip not found"; exit 1; }
mkdir -p "$SRC/assets/shared"
rsync -a --delete --exclude '.DS_Store' --exclude 'follow-overlay.mov' \
  "$HERE/assets/" "$SRC/assets/shared/"
TMP=$(mktemp -d)
mkdir -p "$TMP/juarasilat-video"
rsync -a --exclude '.DS_Store' --exclude '__pycache__' --exclude '*.pyc' \
  --exclude 'follow-overlay.mov' "$SRC/" "$TMP/juarasilat-video/"
rm -f "$HERE/juarasilat-video.skill"
(cd "$TMP" && zip -q -r -X "$HERE/juarasilat-video.skill" juarasilat-video)
rm -rf "$TMP"
ls -lh "$HERE/juarasilat-video.skill" | awk '{print $5, $9}'
shasum -a 256 "$HERE/juarasilat-video.skill"
