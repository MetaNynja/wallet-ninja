let wallets = [];

document.getElementById('startBtn').addEventListener('click', () => {
  const prefixes = document.getElementById('prefixes').value;
  const workers = parseInt(document.getElementById('workers').value) || 1;
  if (!prefixes) {
    alert('Please enter at least one prefix.');
    return;
  }
  if (!document.getElementById('offlineConfirm').checked) {
    alert('Please confirm you are offline for security.');
    return;
  }
  document.getElementById('startBtn').disabled = true;
  document.getElementById('stopBtn').disabled = false;
  document.getElementById('saveBtn').disabled = true;
  window.electronAPI.send('start-generation', { prefixes, numWorkers: workers });
});

document.getElementById('stopBtn').addEventListener('click', () => {
  window.electronAPI.send('stop-generation');
  document.getElementById('startBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;
  document.getElementById('saveBtn').disabled = wallets.length === 0;
});

window.electronAPI.on('max-workers', (maxWorkers) => {
  document.getElementById('maxWorkers').textContent = maxWorkers;
  document.getElementById('workers').max = maxWorkers;
  document.getElementById('workers').value = 1;
});

window.electronAPI.on('update-progress', (attempts) => {
  document.getElementById('attempts').textContent = attempts.toLocaleString();
  const progress = Math.min((attempts % 10000) / 100, 100);
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressBar').setAttribute('aria-valuenow', progress);
});

window.electronAPI.on('new-result', ({ address, seed, prefix }) => {
  const table = document.getElementById('resultsTable');
  const row = table.insertRow();
  row.innerHTML = `<td>${address}</td><td>${seed}</td><td>${prefix}</td>`;
  wallets.push({ address, seed, prefix, generated: new Date().toISOString() });
  document.getElementById('saveBtn').disabled = false;
});

window.electronAPI.on('error', (message) => {
  alert(message);
  document.getElementById('startBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;
  document.getElementById('saveBtn').disabled = wallets.length === 0;
});

window.electronAPI.on('done', (message) => {
  alert(message);
  document.getElementById('startBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;
  document.getElementById('saveBtn').disabled = wallets.length === 0;
});

document.getElementById('saveBtn').addEventListener('click', async () => {
  const result = await window.electronAPI.invoke('save-results', wallets);
  if (result.success) {
    alert(`Results saved to ${result.filePath}`);
  } else {
    alert(result.message || 'Failed to save results');
  }
});