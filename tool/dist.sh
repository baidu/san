#! /bin/sh

TOOL_DIR=$(dirname "$0")
ROOT_DIR="${TOOL_DIR}/.."
DIST_DIR="${ROOT_DIR}/dist"
SRC_DIR="${ROOT_DIR}/src"

if [ ! -d "${DIST_DIR}" ]
then
    mkdir "${DIST_DIR}"
fi

sed 's/define(\[\], san)/define("san-core", [], san)/' "${SRC_DIR}/main.js" > "${DIST_DIR}/san.source.js"
uglifyjs "${DIST_DIR}/san.source.js" -mco "${DIST_DIR}/san.js"
