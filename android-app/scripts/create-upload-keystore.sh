#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KEYSTORE_PATH="${1:-$ROOT_DIR/upload-keystore.jks}"

if [[ -f "$KEYSTORE_PATH" ]]; then
  echo "Keystore already exists: $KEYSTORE_PATH"
  exit 1
fi

echo "Creating upload keystore at: $KEYSTORE_PATH"
echo "You will be prompted for passwords and certificate fields."

"${JAVA_HOME:+$JAVA_HOME/bin/}keytool" \
  -genkeypair \
  -v \
  -keystore "$KEYSTORE_PATH" \
  -alias upload \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

echo
echo "Done. Update android-app/keystore.properties with:"
echo "storeFile=../$(basename "$KEYSTORE_PATH")"
echo "keyAlias=upload"
