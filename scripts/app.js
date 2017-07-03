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
    $scope.board = window.board;
    $scope.showStartButton = false;
    $scope.showLogin = false;
    $scope.waitForStart = false;
    $scope.isMainBoard = false;

    JeoSocket.on('connect', function() {
      console.log('Connect!!!');
      $scope.showLogin = true;
    });
    JeoSocket.on('jeo_response', (resp) => {
      console.log('Got response' + resp);
    });

    JeoSocket.on('game_started', (resp) => {
      $scope.waitForStart = false;
      console.log('game_started');
    });

    JeoSocket.on('host_connected', (resp) => {
      console.log('host_connected');
      console.log(resp);
    });

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

    $scope.login = function(teamName){
      JeoSocket.emit('login', {'teamName': teamName});
      $scope.showLogin = false;
      $scope.teamName = teamName;
      $scope.isMainBoard = teamName == 'host';
      if (!$scope.isMainBoard){
        $scope.waitForStart = true;
      } else {
        $scope.showStartButton = true;
      }
    };

    $scope.startGame = function(){
      JeoSocket.emit('host_started_game', null);
    };

    $scope.push_button = function(){
      JeoSocket.emit('player_pushed_button', function(data){
        console.log('You have pushed the button!')
        console.log(data);
      });
    };
  });
})();
