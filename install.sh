#!/bin/sh
# Install the Juara Silat video skill together with its shared asset library.
# The package already carries assets/shared/ (brand, fonts, transparent CTA WebM
# + code, CTA audio stems, SFX, music, telestrator code), so nothing else is
# needed after this script.
#
# Usage, from a clone of this repository:
#   sh install.sh                  # into every personal skills folder found
#   sh install.sh --claude         # $HOME/.claude/skills
#   sh install.sh --codex          # $HOME/.agents/skills
#   sh install.sh --repo <dir>     # <dir>/.agents/skills (project-scoped)
#   sh install.sh --with-prores    # also fetch follow-overlay.mov (188 MB) from the release
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
PKG="$HERE/juarasilat-video.skill"
[ -f "$PKG" ] || { echo "package not found: $PKG"; exit 1; }
command -v unzip >/dev/null || { echo "unzip not found"; exit 1; }

PRORES=0
TARGETS=""
while [ $# -gt 0 ]; do
  case "$1" in
    --claude) TARGETS="$TARGETS $HOME/.claude/skills";;
    --codex)  TARGETS="$TARGETS $HOME/.agents/skills";;
    --repo)   shift; [ -n "$1" ] || { echo "--repo needs a directory"; exit 1; }
              TARGETS="$TARGETS $1/.agents/skills";;
    --with-prores) PRORES=1;;
    -h|--help) sed -n '2,13p' "$0"; exit 0;;
    *) echo "unknown option: $1"; exit 1;;
  esac
  shift
done

if [ -z "$TARGETS" ]; then
  [ -d "$HOME/.claude/skills" ] && TARGETS="$TARGETS $HOME/.claude/skills"
  [ -d "$HOME/.agents/skills" ] && TARGETS="$TARGETS $HOME/.agents/skills"
  [ -n "$TARGETS" ] || TARGETS="$HOME/.agents/skills"
fi

for DIR in $TARGETS; do
  mkdir -p "$DIR"
  unzip -o -q "$PKG" -d "$DIR"
  echo "installed: $DIR/juarasilat-video"
  if [ "$PRORES" = "1" ]; then
    sh "$DIR/juarasilat-video/scripts/fetch_prores.sh"
  fi
done

echo
echo "shared library: <skill>/assets/shared  (override with JUARASILAT_ASSETS)"
echo "new film:       sh <skill>/scripts/new_film.sh <name> <parent-folder> [url]"
echo "ProRes 4444 alpha CTA overlay is a release asset: sh <skill>/scripts/fetch_prores.sh"
