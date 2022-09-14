# Finance Manager

Angular UI to locally document your finances like salary, insurances or regular expenses.
Depends on FinanceApi project to serve the apis.

## Versions  

- Angular: 14
- Bootstrap:
- Chart.js

## Run

### Docker

```bash
ng build --configuration production
docker build -t finance-manager .
docker run --name finance-manager-container -d -p 4567:80 finance-manager
```

### Server Git - Selfhosted

Create a new docker image using `docker build` and run it via `docker-compose`.

```bash
ng build --configuration production
docker build -t finance-manager .
cd
cd Server/finance-app
docker-compose up -d
```