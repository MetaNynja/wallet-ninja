const { parentPort, workerData } = require('worker_threads');
const keypairs = require('ripple-keypairs');

let { prefixes, workerId } = workerData;
let attempts = 0;
let lastReport = Date.now();

parentPort.on('message', (msg) => {
  if (msg.type === 'updatePrefixes') {
    prefixes = msg.prefixes;
  }
});

while (true) {
  if (prefixes.length === 0) {
    parentPort.postMessage({ type: 'progress', attempts });
    break;
  }

  const seed = keypairs.generateSeed();
  const keypair = keypairs.deriveKeypair(seed);
  const address = keypairs.deriveAddress(keypair.publicKey);
  attempts++;

  if (attempts >= 1000 || Date.now() - lastReport >= 1000) {
    parentPort.postMessage({ type: 'progress', attempts });
    attempts = 0;
    lastReport = Date.now();
  }

  const matchedPrefix = prefixes.find(p => address.toLowerCase().startsWith(p));
  if (matchedPrefix) {
    parentPort.postMessage({ type: 'progress', attempts });
    parentPort.postMessage({ type: 'result', seed, attempts: 0, workerId });
    prefixes = prefixes.filter(p => p !== matchedPrefix);
  }
}