const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { Worker } = require('worker_threads');
const path = require('path');
const os = require('os');
const fs = require('fs');
const keypairs = require('ripple-keypairs');

let mainWindow;
let workers = [];
let totalAttempts = 0;
let foundWallets = [];
let remainingPrefixes = [];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadFile('index.html');
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('max-workers', os.cpus().length - 1);
  });
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on('start-generation', (event, { prefixes, numWorkers }) => {
  remainingPrefixes = prefixes.split(',').map(p => p.trim().toLowerCase());
  totalAttempts = 0;
  foundWallets = [];
  workers = [];

  // Validate prefixes
  for (const prefix of remainingPrefixes) {
    if (!prefix.startsWith('r') || !/^[r][a-zA-Z0-9]+$/.test(prefix)) {
      mainWindow.webContents.send('error', `Invalid prefix "${prefix}". Must start with "r" and contain only alphanumeric characters.`);
      return;
    }
  }

  // Create workers
  for (let i = 0; i < numWorkers; i++) {
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: { prefixes: remainingPrefixes, workerId: i }
    });
    workers.push(worker);

    worker.on('message', (msg) => {
      if (msg.type === 'progress') {
        totalAttempts += msg.attempts;
        mainWindow.webContents.send('update-progress', totalAttempts);
      } else if (msg.type === 'result') {
        const keypair = keypairs.deriveKeypair(msg.seed);
        const finalAddress = keypairs.deriveAddress(keypair.publicKey);
        const matchedPrefix = remainingPrefixes.find(p => finalAddress.toLowerCase().startsWith(p));
        if (!matchedPrefix) return;

        foundWallets.push({ address: finalAddress, seed: msg.seed, prefix: matchedPrefix });
        mainWindow.webContents.send('new-result', { address: finalAddress, seed: msg.seed, prefix: matchedPrefix });

        // Save to wallets.txt in app directory
        fs.appendFileSync('wallets.txt',
          `Address: ${finalAddress}\nSeed: ${msg.seed}\nPrefix: ${matchedPrefix}\nGenerated: ${new Date().toISOString()}\n\n`,
          'utf8'
        );

        remainingPrefixes = remainingPrefixes.filter(p => p !== matchedPrefix);
        workers.forEach(w => w.postMessage({ type: 'updatePrefixes', prefixes: remainingPrefixes }));

        if (remainingPrefixes.length === 0) {
          mainWindow.webContents.send('done', 'All prefixes found.');
          workers.forEach(w => w.terminate());
          workers = [];
        }
      }
    });

    worker.on('error', (err) => {
      mainWindow.webContents.send('error', `Worker error: ${err.message}`);
      workers.forEach(w => w.terminate());
      workers = [];
    });
  }
});

ipcMain.on('stop-generation', () => {
  workers.forEach(w => w.terminate());
  workers = [];
  mainWindow.webContents.send('done', 'Generation stopped.');
});

ipcMain.handle('save-results', async (event, wallets) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Wallet Results',
      defaultPath: 'wallets.txt',
      filters: [{ name: 'Text Files', extensions: ['txt'] }]
    });
    if (!result.canceled && result.filePath) {
      const content = wallets
        .map(w => `Address: ${w.address}\nSeed: ${w.seed}\nPrefix: ${w.prefix}\nGenerated: ${w.generated}\n\n`)
        .join('');
      fs.writeFileSync(result.filePath, content, 'utf8');
      return { success: true, filePath: result.filePath };
    }
    return { success: false, message: 'Save canceled' };
  } catch (err) {
    return { success: false, message: `Error saving file: ${err.message}` };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});