#!/usr/bin/env bash
set -euo pipefail

# Get latest git tag (strip leading 'v' for semver in package.json)
LATEST_TAG=$(git describe --tags --abbrev=0)
VERSION="${LATEST_TAG#v}"

echo "Releasing version: $VERSION (tag: $LATEST_TAG)"

# Update version in package.json (no git commit/tag)
npm version "$VERSION" --no-git-tag-version

# Build and zip via WXT (outputs to .output/page-raptor-v<version>.zip)
npx wxt zip

echo "Done: page-raptor-v${VERSION}.zip"
