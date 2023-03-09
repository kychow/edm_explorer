/* Test Node.js is installed and set up correctly. */
/* Load the HTTP library */
var http = require('http');

/* Create an HTTP server on digital ocean droplet to handle responses */

http
  .createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write('Hello World');
    response.end();
  })