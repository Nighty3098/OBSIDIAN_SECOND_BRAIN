#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

current_date=$(date +"%Y-%m-%d %H:%M:%S")
device_name=$(hostname)

echo "Starting..."

git pull --ff-only || { echo "Git pull failed"; }

git add .
commit_msg="${current_date} PUSH BY ${device_name}"
git commit -m "${commit_msg}" || echo "No changes to commit"

git push origin main || {
    echo "Git push failed"
    exit 1
}

git pull --ff-only || {
    echo "Final git pull failed"
    exit 1
}

echo "DONE"
