var electron = require("electron");
var ipc = electron.ipcMain;
var EventEmitter = require("events");

electron.app.on("ready", function() {

  // create the world, requiring scenes in doing so
  var world = {
    scenes: {
      airlock: require("./scenes/airlock"),
      whitebox: { id: "whitebox" }
    },
    player: {
      inventory: []
    }
  };

  world.currentScene = world.scenes.airlock;

  var Story = require("./activities/story");
  var storyActivity = new Story(world);

  storyActivity.window.on("closed", () => electron.app.exit(0));

  var deck = require("./activities/deck");

  // why isn't this in the story activity or on the world object? it is a mystery.
  electron.app.on("change-scene", (location = world.scenes.whitebox) => {
    if (world.currentScene.triggers && world.currentScene.triggers.exit) world.currentScene.triggers.exit(world);
    world.currentScene = location;
    if (location.triggers && location.triggers.enter) location.triggers.enter(world);
    // this is kind of gross.
    deck.disconnect();
    deck.setAvailable(world.currentScene.ports || {});
    storyActivity.update();
  });

});

