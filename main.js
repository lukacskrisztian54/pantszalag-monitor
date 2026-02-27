const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  // Kamera engedélyek teljes feloldása
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true); // Automatikusan engedélyez minden kamera kérést
    } else {
      callback(true);
    }
  });

  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    if (permission === 'media') return true;
    return true;
  });

  const win = new BrowserWindow({
    width: 1400,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    title: 'Pántszalag Monitor',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Teljes kamera hozzáférés - minden korlátozás nélkül
      allowRunningInsecureContent: false,
    },
    backgroundColor: '#0a0c0e',
    show: false, // Csak akkor mutatja ha kész
  });

  // Maximalizálva indul
  win.maximize();
  win.show();

  // HTML betöltése
  win.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Kamera engedély a file:// protokollhoz
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(true);
  });

  // DevTools fejlesztéshez (éles verzióban kommenteld ki)
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  // Tiltjuk a CORS és biztonsági korlátozásokat a kamera miatt
  app.commandLine.appendSwitch('allow-file-access-from-files');
  app.commandLine.appendSwitch('disable-web-security');
  app.commandLine.appendSwitch('allow-running-insecure-content');
  app.commandLine.appendSwitch('use-fake-ui-for-media-stream', 'false');

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
