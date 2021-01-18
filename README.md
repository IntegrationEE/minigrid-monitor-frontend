# Minigrid Monitor API

The Minigrid Monitor is a web-based system to monitor and track performance of 
[Minigrids](https://en.wikipedia.org/wiki/Mini-grids) within a whole country.

This repo holds the Frontend part and needs a running instance of the bachkend. The repo can be found here.

## Feature List:
- dedicated User-Mangement
- access performance via Portfolio and Site Level
- map view of all minigrids within the country
- enter data by manual entry, csv and api 
- data validation on entry

## Architecture:
- MVC Arcitecture:
    - Backend .net core 
    - Frontend Angular
    - Database mainly build for Postgres

## Public instances
- [Nigeria MinigridMonitor](https://minigridmonitor.nigeriase4all.gov.ng)




## Development Setup
- you need a running Postgres database and a running Backend API, the code you can find here
- install all dependencies via npm install
- set up the envioronment via:
        
        src\environments\environment.dev.ts

- run ng serve for a local development server

## Production Setup 
- you need a running Postgres database and a running Backend API, the code you can find here
- install all dependencies via npm install
- set up the envioronment via:
        
        src\environments\environment.prod.ts

- build the Frontend with ng build 


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.2.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
