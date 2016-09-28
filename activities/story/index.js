var electron = require("electron");
var ipc = electron.ipcMain;

var deck = require("../deck");

var Story = function(world) {
  this.world = world;

  var storyWindow = this.window = new electron.BrowserWindow({
    show: false,
    center: true,
    // frame: false
    fullscreenable: false,
    resizable: false
  });
  storyWindow.toggleDevTools();
  storyWindow.loadURL(`file://${__dirname}/story.html`);
  storyWindow.once("ready-to-show", () => storyWindow.show());

  //currently world updates are only routinely sent to the story window
  ipc.on("request-scene", () => this.update());
  electron.app.on("update-world", () => this.update());

  // why is this here and not in the adventure JS? why not?
  ipc.on("story-trigger", (source, event) => {
    var scene = world.currentScene;
    if (scene.triggers && event in scene.triggers) {
      scene.triggers[event](world);
    } else {
      //handle out-of-scene triggers, like airlock:remote-open
    }
    this.update();
  });

};

Story.prototype = {
  update: function() {
    this.window.webContents.send("update-scene", this.world);
  }
}

module.exports = Story;