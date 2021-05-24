# Finance Manager

Angular UI to locally document your finances like salary, insurances or regular expenses.

## Versions  

Angular: 11.2.7
Bootstrap: 4.6.0
Chart.js: 2.9.4
Storybook: 6.2.9

## Run

### Docker

```bash
ng build --prod
docker build -t finance-manager .
docker run --name finance-manager-container -d -p 4567:80 finance-manager
```

### Angular CLI

App: `npm run start`  

Storybook: `npm run storybook`  
