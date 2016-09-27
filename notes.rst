Unnamed adventure
=================

* Uses multiple windows for different gameplay chunks
* Main window is a Twine-like clickable story, built in Angular
* World is maintained in the main process, and read-only data object is shipped to the story activity via IPC
* Activities communicate back to the main world using IPC. The story listens for trigger events, then routes those to the current scene
* The deck can connect to various console interfaces. Each is basically its own mini-trigger collection, but with ``connect``, ``disconnect``, and ``line`` triggers defined instead of arbitrary commands. State should be kept in the scene, not the device.

World object::

    {
      player: {
        inventory: [],
        [arbitrary properties]
      },
      scenes: {
        sampleScene: {
          [arbitrary properties]
          triggers: {
            enter: [optional setup function called when the scene is entered],
            doSomething: [function that's called on the ``doSomething`` story trigger event],
            exit: [optional teardown function]
          },
          ports: {
            "device.hostname": {
              connect: [optional function for when the deck connects to randomDevice],
              input: [function called with each line sent from the deck]
              disconnect: [optional teardown function]
            }
          }
        }
      },
      currentScene: [Reference to active story scene]
    }

Concepts
========

You're a troubleshooter on an underwater research station. The station was abandoned in the late 1990's, but if you can get it up and running, you can bring your family in to stay there safely. Restarting the station means debugging faulty machinery, draining water and unlocking living quarters, and avoiding whatever's been haunting its hallways since the original shutdown.

