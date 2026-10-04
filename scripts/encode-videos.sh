#!/usr/bin/env bash
# Re-encodes every video listed in scripts/videos.csv into web-ready files.
#
# Usage: scripts/encode-videos.sh [--force] [slug...]
#   --force   re-create outputs that already exist
#   slug...   only process these slugs (default: all rows)
#
# Outputs go to video-out/v2/<slug>/, mirroring the S3 prefix:
#   <slug>-1080.mp4          full playback, short side 1080, CRF 23 (skipped if the source is 720p or less)
#   <slug>-720.mp4           full playback, short side 720, CRF 24
# Nothing is upscaled, and a full-playback file is never bigger than its source:
# if re-encoding a same-size source would grow it, the source is remuxed instead.
#   <slug>-preview.mp4       5s muted loop, short side 480, CRF 28 capped at 700 kbps
#   <slug>-poster-640.webp   poster, long side 640
#   <slug>-poster-1280.webp  poster, long side 1280 (capped at source size)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/scripts/videos.csv"
OUT="$ROOT/video-out/v2"
PREVIEW_LEN=5
PREVIEW_MAX_BYTES=$((500 * 1024))

FORCE=0
ONLY=()
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    *) ONLY+=("$arg") ;;
  esac
done

command -v ffmpeg >/dev/null || { echo "ffmpeg not found" >&2; exit 1; }
[[ "$(ffmpeg -hide_banner -encoders 2>/dev/null)" == *libwebp* ]] || { echo "ffmpeg lacks libwebp" >&2; exit 1; }

# Scale so the SHORT side equals $1, never upscaling (works for landscape and portrait).
short_side() { echo "scale='if(gt(iw,ih),-2,min($1,iw))':'if(gt(iw,ih),min($1,ih),-2)'"; }
# Scale so the LONG side equals $1, never upscaling.
long_side() { echo "scale='if(gt(iw,ih),min($1,iw),-2)':'if(gt(iw,ih),-2,min($1,ih))'"; }

# Skip existing outputs unless --force.
needs() { [[ $FORCE -eq 1 || ! -s "$1" ]]; }

size_of() { [[ -f "$1" ]] && stat -c %s "$1" || echo 0; }
human() { numfmt --to=iec --suffix=B --format='%.1f' "$1"; }

encode_full() { # in out short_side crf
  ffmpeg -nostdin -hide_banner -loglevel error -stats -y -i "$1" \
    -c:v libx264 -profile:v high -crf "$4" -preset slow -pix_fmt yuv420p \
    -vf "$(short_side "$3")" -c:a aac -b:a 128k -movflags +faststart "$2.tmp.mp4"
  # Already-compressed sources (e.g. social media exports) can grow when re-encoded
  # at the same size; keep the original stream then, just with faststart.
  if [[ $short -le $3 && $(size_of "$2.tmp.mp4") -gt $(size_of "$1") && "$pix_fmt" == yuv420p && "$codec" == h264 ]]; then
    echo "   (re-encode was larger than the source; remuxing the original instead)"
    ffmpeg -nostdin -hide_banner -loglevel error -y -i "$1" -c copy -movflags +faststart "$2.tmp.mp4"
  fi
  mv "$2.tmp.mp4" "$2"
}

ROWS=()
while IFS=, read -r slug input poster_at preview_at orientation; do
  [[ "$slug" == "slug" || -z "$slug" || "$slug" == \#* ]] && continue
  if [[ ${#ONLY[@]} -gt 0 && ! " ${ONLY[*]} " =~ " $slug " ]]; then continue; fi

  input="${input/#\~/$HOME}"
  [[ "$input" = /* ]] || input="$ROOT/$input"
  if [[ ! -f "$input" ]]; then
    echo "!! $slug: input not found: $input" >&2
    continue
  fi

  IFS=x read -r w h < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$input" </dev/null)
  actual=$([[ $w -gt $h ]] && echo landscape || echo portrait)
  [[ "$actual" == "$orientation" ]] || echo "!! $slug: csv says $orientation but file is $actual (${w}x${h})" >&2

  dir="$OUT/$slug"
  mkdir -p "$dir"
  echo "== $slug (${w}x${h})"

  short=$(( w < h ? w : h ))
  IFS=, read -r codec pix_fmt < <(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,pix_fmt -of csv=p=0 "$input" </dev/null)
  f="$dir/$slug-1080.mp4"
  if [[ $short -le 720 ]]; then
    echo "   1080p skipped (source is ${short}p)"
  elif needs "$f"; then
    echo "   1080p"; encode_full "$input" "$f" 1080 23
  fi
  f="$dir/$slug-720.mp4";  needs "$f" && { echo "   720p";  encode_full "$input" "$f" 720 24; }

  f="$dir/$slug-preview.mp4"
  if needs "$f"; then
    echo "   preview @ ${preview_at}s"
    ffmpeg -nostdin -hide_banner -loglevel error -y -ss "$preview_at" -t "$PREVIEW_LEN" -i "$input" -an \
      -c:v libx264 -profile:v high -crf 28 -maxrate 700k -bufsize 1400k -preset slow -pix_fmt yuv420p \
      -vf "$(short_side 480)" -movflags +faststart "$f.tmp.mp4"
    mv "$f.tmp.mp4" "$f"
  fi
  [[ $(size_of "$f") -le $PREVIEW_MAX_BYTES ]] || echo "!! $slug: preview is $(human "$(size_of "$f")"), over 500KB" >&2

  for px in 640 1280; do
    f="$dir/$slug-poster-$px.webp"
    if needs "$f"; then
      ffmpeg -nostdin -hide_banner -loglevel error -y -ss "$poster_at" -i "$input" -frames:v 1 \
        -vf "$(long_side "$px")" -c:v libwebp -quality 80 "$f"
    fi
  done

  ROWS+=("$slug|$(size_of "$input")|$(size_of "$dir/$slug-1080.mp4")|$(size_of "$dir/$slug-720.mp4")|$(size_of "$dir/$slug-preview.mp4")|$(size_of "$dir/$slug-poster-640.webp")|$(size_of "$dir/$slug-poster-1280.webp")")
done < "$MANIFEST"

[[ ${#ROWS[@]} -gt 0 ]] || exit 0

echo
printf '| %-32s | %9s | %9s | %7s | %9s | %8s | %9s |\n' slug source 1080p saved 720p preview posters
printf '|%s|%s|%s|%s|%s|%s|%s|\n' "$(printf -- '-%.0s' {1..34})" ----------- ----------- --------- ----------- ---------- -----------
t_src=0 t_1080=0 t_720=0 t_prev=0 t_post=0
for row in "${ROWS[@]}"; do
  IFS='|' read -r slug src s1080 s720 sprev sp640 sp1280 <<<"$row"
  post=$((sp640 + sp1280))
  best=$([[ $s1080 -gt 0 ]] && echo "$s1080" || echo "$s720")
  saved=$([[ $src -gt 0 ]] && echo "$(( 100 - best * 100 / src ))%" || echo "-")
  printf '| %-32s | %9s | %9s | %7s | %9s | %8s | %9s |\n' "$slug" "$(human "$src")" "$(human "$s1080")" "$saved" "$(human "$s720")" "$(human "$sprev")" "$(human "$post")"
  t_src=$((t_src + src)) t_1080=$((t_1080 + s1080)) t_720=$((t_720 + s720)) t_prev=$((t_prev + sprev)) t_post=$((t_post + post))
done
t_saved=$([[ $t_src -gt 0 ]] && echo "$(( 100 - t_1080 * 100 / t_src ))%" || echo "-")
printf '| %-32s | %9s | %9s | %7s | %9s | %8s | %9s |\n' "**total**" "$(human "$t_src")" "$(human "$t_1080")" "$t_saved" "$(human "$t_720")" "$(human "$t_prev")" "$(human "$t_post")"
