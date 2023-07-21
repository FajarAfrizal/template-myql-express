// Import Modules
const express = require('express');
const fs = require('fs');
const verifyToken = require('../passports/jwt');

// Declarations
const Route = express.Router();
const v1 = '/api/v1';

// Routes
const allFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file !== 'index.js');

for (const file of allFiles) {
  let route = '';
  let routePath = '';

  // handle folder
  if (!file.includes('js')) {
    // kalau folder (bukan file js)
    const tempRoutes = fs.readdirSync(`${__dirname}/${file}`);
    for (const tempRoute of tempRoutes) {
      route = require(`./${file}/${tempRoute}`);
      routePath = `${v1}/${file}/${tempRoute.substring(
        0,
        tempRoute.length - 3
      )}`;
      if (!route.auth) {
        Route.use(routePath, route.Route);
      } else {
        Route.use(routePath, verifyToken, route.Route);
      }
    }
  } else {
    // kalau bukan folder (file js)
    route = require(`./${file}`);
    routePath = `${v1}/${file.substring(0, file.length - 3)}`;
    if (!route.auth) {
      Route.use(routePath, route.Route);
    } else {
      Route.use(routePath, verifyToken, route.Route);
    }
  }
}

module.exports = Route;
