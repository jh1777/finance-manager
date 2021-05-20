#!/bin/bash

# OLD:: pkill -f "ng serve --port 4567"

docker stop finance-manager
docker rm finance-manager
git pull
ng build --prod
docker build -t finance-manager .
docker run --name finance-manager-container -d -p 4567:80 finance-manager