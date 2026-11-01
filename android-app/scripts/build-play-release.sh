#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/opt/openjdk}"
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}"
export ANDROID_HOME="$ANDROID_SDK_ROOT"

if [[ ! -f "$ROOT_DIR/keystore.properties" ]]; then
  echo "Missing $ROOT_DIR/keystore.properties"
  echo "Copy keystore.properties.example and set your upload key credentials."
  exit 1
fi

gradle -p "$ROOT_DIR" clean bundleRelease

echo
echo "AAB:"
ls -la "$ROOT_DIR/app/build/outputs/bundle/release/app-release.aab"
