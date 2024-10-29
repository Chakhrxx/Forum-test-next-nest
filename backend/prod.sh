#!/bin/bash

docker-compose -p nestjs_scale up -d --scale nestjs=2

docker-compose -f docker-compose.yaml -p nestjs_scale up  -d --build

docker-compose -f docker-compose.yaml -p nestjs_stack down  --volumes --remove-orphans || true
docker-compose -f docker-compose.yaml -p nestjs_stack up  -d --build

docker-compose -f docker-compose.yaml -p forum_backend down  --volumes --remove-orphans || true
docker-compose -f docker-compose.yaml -p forum_backend up  -d --build