const http = require('http');
const httpProxy = require('http-proxy');
const { URL } = require('url');
const { request } = require('http');

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Create the HTTP server
const server = http.createServer((req, res) => {
  console.log(`Incoming request path: ${req.url}`);

  // Determine the target URL based on the request path
  let targetUrl;

  switch (req.url) {
    case '/':
      targetUrl = 'http://localhost:3000/7am/gen/page/landingPage/n';
      break;
    default:
       targetUrl = `http://localhost:3000${req.url}`;
       break;
  }

  // Parse the target URL
  console.log(`Forwarding it to: ${targetUrl}`);
  console.log("   ");

  const url = new URL(targetUrl);

  // Make an HTTP request to the target URL
  const options = {
    hostname: url.hostname,
    port: url.port || 80,
    path: url.pathname + url.search,
    method: req.method,
    headers: req.headers
  };

  const proxyRequest = request(options, (proxyResponse) => {
    // Set the response headers
    res.writeHead(proxyResponse.statusCode, proxyResponse.headers);

    // Pipe the response data from the target server back to the client
    proxyResponse.pipe(res);
  });

  // Handle errors
  proxyRequest.on('error', (err) => {
    console.error('Request error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });

  // Pipe the request data from the client to the target server
  req.pipe(proxyRequest);
});

// Start listening on port 2001
server.listen(3001, () => {
  console.log('Server listening on port 3001');
});

