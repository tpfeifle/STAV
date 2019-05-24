/*
Put content of angular2 build into 'public' folder.
*/
const html = __dirname + '/dist/web-frontend/';

const port = 4000;

// Express
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
var app = express();

app
  .use(compression())
  .use(bodyParser.json())
  // Static content
  .use(express.static(html))
  // Default route
  .use(function(req, res) {
    res.sendFile(html + 'index.html');
  })
  // Start server
  .listen(port, function() {
    console.log('Port: ' + port);
    console.log('Html: ' + html);
  });

// continue with api code below ...
