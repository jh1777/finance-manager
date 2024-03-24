# Finance Manager UI

Angular UI to locally log your finances like salary, insurances or regular expenses.
Depends on FinanceApi project to serve the apis.
Personal (private) use only!

## Versions  

- Angular 17
- ngx-bootstrap
- Ag Charts Community

## Run

### Docker

```bash
ng build -c production
docker build -t finance-manager .
docker run --name finance-manager-ui -d -p 4567:80 finance-manager
```

### Server Git - Selfhosted

Create a new docker image using `docker build` and run it via `docker-compose`.

```bash
ng build -c production
cd ~/Server/finance-app
docker-compose build
docker-compose up -d
```