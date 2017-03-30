#! /bin/sh

TOOL_DIR=$(dirname "$0")
ROOT_DIR="${TOOL_DIR}/.."
DIST_DIR="${ROOT_DIR}/dist"
SRC_DIR="${ROOT_DIR}/src"

rm -rf "${DIST_DIR}"

if [ ! -d "${DIST_DIR}" ]
then
    mkdir "${DIST_DIR}"
fi

VERSION=$(grep "version" "${ROOT_DIR}/package.json" | cut -d '"' -f 4)

sed -e "s/define(\[\], san)/define('san', [], san)/; s/version: '##version##'/version: '${VERSION}'/" "${SRC_DIR}/main.js" > "${DIST_DIR}/san.source.js"
# uglifyjs "${DIST_DIR}/san.source.js" -mco "${DIST_DIR}/san.js"
