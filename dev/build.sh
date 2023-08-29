#!/usr/bin/env bash

set -e
set -o pipefail

SCRIPT_PATH="$(dirname "$0")"
ROOT_PATH="${SCRIPT_PATH}/.."
CI_PATH="${ROOT_PATH}/ci"

IMAGE_NAME="node-starter"

docker build \
  --file "${CI_PATH}/Dockerfile" \
  --tag "${IMAGE_NAME}:latest" \
  "${ROOT_PATH}/"
