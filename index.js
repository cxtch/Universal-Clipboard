import * as http from 'http';
import clipboardy from 'clipboardy';
import {
  createRequire
} from 'module';
const require = createRequire(
  import.meta.url)
const config = require('./config.json');
let cache = {
  text: clipboardy.readSync(),
  timestamp: Date.now()
};
setInterval(() => {
  let current;
  try {
    current = clipboardy.readSync();
  } catch (err) {
    //clipboardy only supports strings
    console.error("data on clipboard cannot be read")
  }
  if (current !== cache.text) {
    cache.text = current;
    cache.timestamp = Date.now();
  }
}, 500)
const requestListener = (req, res) => {
  res.writeHead(200);
  req.on('data', (chunk) => {
    let data = JSON.parse(chunk.toString());
    if (data.timestamp > cache.timestamp) {
      try {
        clipboardy.writeSync(data.text);
        cache.timestamp = data.timestamp;
      } catch (err) {
        console.error("data could not be transferred")
      }
    }
  })
  res.end(JSON.stringify(cache))
};
const server = http.createServer(requestListener);
server.listen(config.port)