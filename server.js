// Development test server
// 1. npm run start [start the application]
// 2. enter port #
// 3. node server.js [start dev test server]
// 4. Postman -> GET/POST


const http = require('http');
const net = require('net');
const { PerformanceObserver, performance } = require('perf_hooks');

// Create new socket connection
const client = new net.Socket();
client.on('error', () => {
  console.log('socket connection error')
})

const observer = new PerformanceObserver(entries => {
  entries.getEntries().forEach(entry => {
    const { duration, name, startTime, entryType } = entry;
    client.connect(8080, () => {
      client.write(JSON.stringify({
        duration,
        name,
        startTime,
        entryType
      }));
    });
  })
});

observer.observe({
  entryTypes: ['measure']
})

const server = http.createServer((req, res) => {

  req.on('readable', data => {
    performance.mark('/endpoint/start');
  });
  
  res.on('finish', data => {
    performance.mark('/endpoint/end');
    performance.measure('endpoint route', '/endpoint/start', '/endpoint/end');
  });
  
  //timeouts for testing route performance
  switch(req.url) {
    case '/':
      switch (req.method){
        case 'GET':
          // setTimeout(function(){
          //   res.end('GET');
          // }, 2000);
          break;
        case 'POST':
          // setTimeout(function(){
          //   res.end('POST');
          // }, 2000);
          break;
        default:
          return;
        }
      break;
    default:
      return;
  }
})

server.listen(3000, () => {
  console.log('test server listening on port 3000')
});
