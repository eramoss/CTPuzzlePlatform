#!/bin/sh
# Script para dump de base após o build do container com docker-compose
DATE=`date '+%Y-%m-%d-%H-%M'`
CONTAINER=`docker ps | grep ct-puzzle-platform_db | cut -d ' ' -f 1`
echo $CONTAINER
docker container exec "$CONTAINER" pg_dump -h 0.0.0.0 -U postgres -d ct_puzzle_platform | gzip -6 > dump"$DATE".sql.gz