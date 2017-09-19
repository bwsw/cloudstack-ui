#!/bin/sh

set -e

echo "Generating themes"

SRC=src/style/themes
DIST=src/css/themes

if [ ! -d ${DIST} ]; then
  mkdir ${DIST}
fi

for file in $(find ${SRC} -name "*.scss")
do
  basename=${file#${SRC}}
  $(npm bin)/node-sass ${file} --output-style compressed > ${DIST}/${basename%.*}.css
done

echo "Themes generated successfully"
