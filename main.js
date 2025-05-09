const { app, BrowserWindow } = require('electron');
const path = require('path');
const WebSocket = require('ws');
const net = require('net');
const fs = require('fs');

const logFile = path.join(app.getPath('userData'), 'bridge.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
  console.log(logMessage.trim());
}

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  startWebSocketBridge();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function startWebSocketBridge() {
  const wss = new WebSocket.Server({ port: 12345 });
  log('WebSocket server listening on ws://localhost:12345');

  wss.on('connection', (ws) => {
    log('Client connected via WebSocket');

    ws.on('message', (message) => {
      log(`Received message: ${message}`);

      let parsed;
      try {
        parsed = JSON.parse(message);
      } catch (e) {
        log('Invalid JSON received');
        ws.send(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      const xmlCommand = buildXml(parsed.command);
      log(`Sending XML to kassza: ${xmlCommand}`);

      const client = new net.Socket();
      client.connect(6811, '127.0.0.1', () => {
        client.write(xmlCommand);
      });

      let response = '';

      client.on('data', (data) => {
        response += data.toString();
      });

      client.on('end', () => {
        log(`Received response from kassza: ${response}`);
        ws.send(JSON.stringify({ result: response }));
      });

      client.on('error', (err) => {
        log(`TCP error: ${err.message}`);
        ws.send(JSON.stringify({ error: err.message }));
      });
    });

    ws.on('close', () => {
      log('WebSocket client disconnected');
    });
  });
}

function buildXml(command) {
  return `<Command><Type>${command}</Type></Command>`;
}
