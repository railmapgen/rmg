#!/bin/zsh

RANGES=('U+4E00-4FFF' 'U+5000-57FF' 'U+5800-5FFF' 'U+6000-67FF' 'U+6800-6FFF' 'U+7000-77FF' 'U+7800-7FFF' 'U+8000-87FF' 'U+8800-8FFF' 'U+9000-97FF' 'U+9800-9FFF')
CODES=('4E' '50' '58' '60' '68' '70' '78' '80' '88' '90' '98')

function generate_css() {
  cat >>../public/styles/fonts_mtr.css <<EOF
@font-face {
    font-family: 'GenYoMin TW';
    font-style: normal;
    font-weight: 600;
    src: url('../cdn/$1') format('woff2');
    unicode-range: $2;
}

EOF
}

# clear css file
#cat >../public/styles/fonts_mtr.css <<EOF
#EOF

for ((i = 1; i <= $#RANGES; i++)); do
  SUBSET_NAME="GenYoMin-TW-SB.${CODES[i]}.woff2"
  pyftsubset ./GenYoMin-TW-SB.ttf --unicodes="${RANGES[i]}" --flavor="woff" --output-file="../public/cdn/$SUBSET_NAME"
  generate_css $SUBSET_NAME ${RANGES[i]}
done
