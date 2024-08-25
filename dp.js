const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Create a server that listens on port 2001
const server = http.createServer((req, res) => {
  // Check the requested URL
  if (req.url === '/') {
    // Redirect root URL to /dedicated_parents
    proxy.web(req, res, { target: 'http://localhost:3000/dedicated_parents' });
  } else {
    // Proxy all other URLs to port 3000
    proxy.web(req, res, { target: `http://localhost:3000${req.url}` });
  }
});

// Listen on port 2001
server.listen(2001, () => {
  console.log('Server listening on port 2001');
});

