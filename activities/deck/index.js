var electron = require("electron");
var app = electron.app;
var ipc = electron.ipcMain;

var deck = {
  connection: null,
  network: {},
  window: null
};

var facade = {
  //open the UI window
  open() {
    if (deck.window) return;
    var window = deck.window = new electron.BrowserWindow({
      show: false
    });
    window.once("ready-to-show", () => window.show());
    window.loadURL(`file://${__dirname}/index.html`);
  },
  //connect the deck to a compatible object
  connect(port) {
    facade.disconnect();
    facade.open();
    deck.connection = port;
    if (port.connect) port.connect(facade);
  },
  disconnect() {
    if (!deck.connection) return;
    if (deck.connection.disconnect) deck.connection.disconnect(facade);
    deck.connection = null;
    facade.write("disconnected");
  },
  //update the list of available ports
  setAvailable(ports) {
    deck.network = ports;
  },
  write(line) {
    if (!deck.window || !deck.connection) return;
    deck.window.webContents.send("line", line.trim());
  }
};

ipc.on("deck:list-ports", function() {
  if (!deck.window) return;
  deck.window.webContents.send("ports", Object.keys(deck.network));
});

ipc.on("deck:line-input", function(source, line) {
  if (!deck.connection) return;
  deck.connection.input(line.trim().toLowerCase(), facade);
});

module.exports = facade;