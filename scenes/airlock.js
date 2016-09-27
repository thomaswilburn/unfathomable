var electron = require("electron");
var ipc = require("electron").ipcMain;
var app = electron.app;


var scene = {
  id: "airlock",
  backpack: false,
  unlocked: false,
  ports: {
    "airlock.inner": {
      connect: (deck) => deck.write("AIRLOCK DOOR OS V2.1r2016"),
      input: (line, deck) => {
        switch (line) {
          case "exit":
          case "quit":
            return deck.disconnect();

          case "unlock":
            scene.unlocked = true;
            deck.write("Manual unlock procedure -- success");
            break;

          case "help":
          case "?":
            return deck.write(`
UNLOCK - Initiate manual unlock
EXIT - Close debugging connection
Warning: use of the unlock command will void your warranty.`);

          default:
            deck.write("Unrecognized command -- try the help file")
        }
      }
    }
  },
  triggers: {
    "examine-suit": () => scene.backpack = { deck: true },
    "void": world => app.emit("change-scene", world.scenes.hallway),
    "take-deck": world => {
      scene.backpack.deck = false;
      world.player.inventory.push({ label: "Deck", trigger: "deck:activate" });
    }
  }
};

module.exports = scene;