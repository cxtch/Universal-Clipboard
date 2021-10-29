//Use this in the Scriptable app
//the port in your config.json
const port = 8181;
//your computer's ip address on your local network
const ipaddress = '10.0.0.185';
let cache = {
  text: Pasteboard.paste(),
  timestamp: Date.now()
};
const check = async () => {
  const current = Pasteboard.paste();
  if (current !== cache.text) {
    cache.text = current
    cache.timestamp = Date.now()
  }
  const checkUniversal = new Request(`http://${ipaddress}:${port}`);
  const res = await checkUniversal.loadJSON();
  if (res.text !== cache.text) {
    if (res.timestamp > cache.timestamp) {
      Pasteboard.copy(res.text);
      cache.text = res.text;
      cache.timestamp = res.timestamp;
      console.log(res.text)
    } else if (res.timestamp < cache.timestamp) {
      const send = new Request(`http://${ipaddress}:${port}`);
      send.method = 'POST';
      send.body = JSON.stringify(cache)
    }
  }
}
const interval = new Timer();
interval.timeInterval = 500;
interval.repeats = true;
interval.schedule(check);
console.log(interval);