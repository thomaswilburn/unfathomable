require("angular");
var electron = require("electron");
var node = electron.ipcRenderer;

var app = angular.module("story-app", []);

var controller = function($scope) {

  node.on("update-scene", function(source, data) {
    for (var key in data) {
      $scope[key] = data[key];
    }
    $scope.$apply();
  });

  node.send("request-scene");

};

controller.$inject = ["$scope"]

app.controller("story-controller", controller);

// may add functionality later
app.directive("scene", () => ({
  restrict: "E"
}));

app.directive("trigger", () => ({
  restrict: "E",
  link: function(scope, element, attrs) {
    element.on("click", () => {
      node.send("story-trigger", attrs.event);
      element.addClass("triggered");
    });
  }
}));