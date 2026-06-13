#!/usr/bin/env bash
# Fetch curated community & wellbeing assets from Pexels for the Commonwell site.
set -u
# Set your Pexels API key in the environment before running:
#   export PEXELS_API_KEY=your_key_here
KEY="${PEXELS_API_KEY:?Set PEXELS_API_KEY in your environment}"
IMG="assets/img"
VID="assets/video"
mkdir -p "$IMG" "$VID"

# get_img <outfile> <query> <orientation> <index>
get_img () {
  local out="$1" q="$2" orient="$3" idx="${4:-0}"
  local json src
  json=$(curl -s -H "Authorization: $KEY" \
    "https://api.pexels.com/v1/search?query=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$q")&per_page=15&orientation=$orient")
  src=$(echo "$json" | jq -r ".photos[$idx].src.large2x // empty")
  if [ -z "$src" ]; then echo "  ⚠ no result for '$q'"; return 1; fi
  curl -s -L "$src" -o "$IMG/$out"
  local sz=$(wc -c < "$IMG/$out")
  echo "  ✓ $out  ($((sz/1024))KB)  <- $q"
}

echo "=== IMAGES ==="
get_img hero-poster.jpg "diverse community group of people happy together outdoors" landscape 0
get_img about.jpg       "group of volunteers smiling community"                    landscape 1
get_img prog-green.jpg  "people planting community garden"                         landscape 0
get_img prog-youth.jpg  "children playing outdoors park happy"                     landscape 0
get_img prog-skills.jpg "adult learning workshop mentoring class"                  landscape 0
get_img prog-active.jpg "group of people running exercise park"                    landscape 0
get_img prog-mind.jpg   "group yoga meditation outdoors wellbeing"                 landscape 0
get_img prog-elders.jpg "happy elderly friends laughing together"                  landscape 0
get_img event.jpg       "outdoor community festival crowd celebration"             landscape 0
get_img partner.jpg     "corporate team volunteering together"                     landscape 0
get_img give.jpg        "helping hands volunteer giving charity"                   landscape 0
get_img cta.jpg         "sunlight green park trees nature path"                    landscape 0

echo "=== PORTRAITS (testimonials) ==="
get_img voice-1.jpg "portrait smiling black woman outdoors"  portrait 0
get_img voice-2.jpg "portrait smiling older man friendly"    portrait 0
get_img voice-3.jpg "portrait happy young woman natural"     portrait 1
get_img voice-4.jpg "portrait smiling middle aged man"       portrait 0

echo "=== HERO VIDEO ==="
vjson=$(curl -s -H "Authorization: $KEY" \
  "https://api.pexels.com/videos/search?query=diverse%20people%20community%20together%20happy&per_page=10&orientation=landscape&size=medium")
# pick an HD file ~1920 wide (prefer hd quality, width between 1280 and 1920)
vlink=$(echo "$vjson" | jq -r '
  [.videos[].video_files[] | select(.file_type=="video/mp4" and .width>=1280 and .width<=1920)]
  | sort_by(.width) | reverse | .[0].link // empty')
if [ -z "$vlink" ]; then
  vlink=$(echo "$vjson" | jq -r '[.videos[].video_files[] | select(.file_type=="video/mp4")] | sort_by(.width) | .[0].link // empty')
fi
if [ -n "$vlink" ]; then
  curl -s -L "$vlink" -o "$VID/hero.mp4"
  echo "  ✓ hero.mp4 ($(( $(wc -c < "$VID/hero.mp4") /1024/1024 ))MB)  <- $vlink"
else
  echo "  ⚠ no hero video found"
fi

echo "=== DONE ==="
ls -la "$IMG" "$VID"
