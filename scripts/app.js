(() => {
  var app = angular.module("app", ["ui.bootstrap.modal"]);
    app.controller('jeopardyController', ($scope) => {
    $scope.costs = window.costs;
    $scope.board = window.board;
    $scope.players = [];

    var getQuestion = (parrentIdx, idx) => {
      return $scope.board[parrentIdx].questions[idx];
    };

    $scope.showQuestion = (parrentIndex, index) => {
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
