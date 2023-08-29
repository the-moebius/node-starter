#!/usr/bin/env bash

set -e
set -o pipefail

SCRIPT_PATH="$(dirname "$0")"
ROOT_PATH="${SCRIPT_PATH}/.."

IMAGE_NAME="node-starter"

docker run \
  --env-file="${ROOT_PATH}/.env" \
  --env HTTP_PORT=8080 \
  -p 127.0.0.1:8080:8080/tcp \
  -it \
  "${IMAGE_NAME}:latest"
