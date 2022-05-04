#!/bin/bash

echo "<<< Stop old docker container >>>" 
docker stop finance-manager-container

echo "<<< Remove old docker container >>>" 
docker rm finance-manager-container

echo "<<< Pull latest chnages from Git Repo >>>" 
git pull

echo "<<< Build the Angular Application >>>" 
ng build --prod

echo "<<< Build new docker image >>>" 
docker build -t finance-manager .
docker run --name finance-manager-container --restart=on-failure:10 -d -p 4567:80 finance-manager