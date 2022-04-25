#!/bin/bash

# OLD:: pkill -f "ng serve --port 4567"

docker stop finance-manager-container
docker rm finance-manager-container
git pull
ng build --prod
docker build -t finance-manager .
docker run --name finance-manager-container --restart=on-failure:10 -d -p 4567:80 finance-manager
