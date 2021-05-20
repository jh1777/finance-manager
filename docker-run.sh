docker build -t finance-manager .
docker run --name finance-manager-container -d -p 4567:80 finance-manager