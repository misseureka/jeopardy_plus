(() => {
  var namespace = "socket";
  var app = angular.module("app", ["ui.bootstrap.modal", "btford.socket-io"]);

  app.factory("JeoSocket", (socketFactory) => {
    var ioSocket = io.connect('http://' + document.domain + ':' + location.port);
    var socket = socketFactory({
      ioSocket: ioSocket
    });
    return socket;
  });

  app.controller('jeopardyController', ($scope, JeoSocket) => {
    $scope.costs = window.costs;
    $scope.board = window.board;
    $scope.players = [];
    JeoSocket.on('connect', function() {
      console.log('Connect!!!');
    });
    JeoSocket.on('jeo_response', (resp) => {
      console.log('Got response' + resp);
    })

    var getQuestion = (parrentIdx, idx) => {
      return $scope.board[parrentIdx].questions[idx];
    };

    $scope.showQuestion = (parrentIndex, index) => {
      debugger;
      var question = getQuestion(parrentIndex, index);
      var questionText = question.question;
      question.isActive = false;
      $scope.showModal = true;
      $scope.currentQuestion = question;
    };

    $scope.ok = function() {
      $scope.showModal = false;
      $scope.currentQuestion = null;
    };
  });
})();

//app.factory("UserService", function() {
//    var items = ["Peter", "Daniel", "Nina"];
//    return {
//      all: function() {
//        return items;
//      },
//      first: function() {
//        return items[0];
//      }
//    };
//  });
