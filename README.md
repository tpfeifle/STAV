# STAV

## Frontend
Install dependencies
```bash
cd web-frontend
npm install
npm i --only=dev
```

Build Frontend requires the angular CLI (npm install -g @angular/cli)
```bash
ng build
```

To build for production create a file "/web-frontend/src/environments/environment.prod.ts" and then run
```
ng build --prod
```

Serve the content with node server.js

## Backend
Install Dependencies
```bash
cd web-backend
npm install
npm i --only=dev
npm install -g ts-node
```

To build for production create a file "/web-backend/environments/production.env" and then run
```
export NODE_ENV=production
```
To start the backend run:
```
npm run start
```
