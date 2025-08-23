#!/bin/bash

current_date=$(date +"%Y-%m-%d %H:%M:%S")
device_name=$(hostname)

echo -e "Starting ..."

cat TOKEN.md

git pull

git add .
git commit -m "${current_date} PUSH BY ${device_name}"

cat TOKEN.md
git push

git pull

echo -e "DONE"
