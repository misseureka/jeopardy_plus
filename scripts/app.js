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
    //TODO: convert this bullshit to a state machine or something
    $scope.board = window.board;
    $scope.players = [];
    $scope.showStartButton = false;
    $scope.showLogin = false;
    $scope.waitForStart = false;
    $scope.isMainBoard = false;
    $scope.isPlayer = false;
    $scope.showQuestionModal = false;
    $scope.showAnswerModal = false;
    $scope.gameRunning = false;

    JeoSocket.on('connect', () => {
      console.log('Connected');
      $scope.showLogin = true;
    });

    JeoSocket.on('game_started', (resp) => {
      $scope.waitForStart = false;
      $scope.showLocalScore = true;
      console.log('game_started');
    });

    JeoSocket.on('update_board_players', (resp) => {
      console.log(resp);
      $scope.players = resp;
    });

    //player-specific
    //TODO: unsubscribe from needless events (board-specific and player-specific)?
    JeoSocket.on('update_score', (resp) => {
      // TODO: investigate, why we broadcast instead of pushing to the correct sid
      if ($scope.teamName == resp['playerName']){
        $scope.playerTotal = resp['total'];
        console.log('current score updated');
        console.log(resp);
      } else {
        console.log('Tried to update the wrong player');
      }
    });

    JeoSocket.on('host_connected', (resp) => {
      console.log('host_connected');
      console.log(resp);
    });

    JeoSocket.on('player_ready', (resp) => {
      console.log('Player ready');
      console.log(resp);
      $scope.currentPlayer = resp['name']
      $scope.currentSid = resp['sid']
    });


    var getQuestion = (parentIdx, idx) => {
      return $scope.board[parentIdx].questions[idx];
    };

    $scope.showQuestion = (parentIndex, index) => {
      var question = getQuestion(parentIndex, index);
      var questionText = question.question;
      question.isActive = false;
      $scope.showQuestionModal = true;
      $scope.currentQuestion = question;
      $scope.currentQuestion.category = $scope.board[parentIndex].category
      $scope.currentScore = question.cost;
      JeoSocket.emit('question_active', true);
    };

    var showAnswer = (answer) => {
      $scope.currentAnswer = answer;
      $scope.showAnswerModal = true;
    };

    $scope.hideAnswer = () => {
      $scope.CurrentAnswer = null;
      $scope.showAnswerModal = false;
    };

    $scope.answer = (currentPlayer, questionScore, correct) => {
      if (correct === null && questionScore === 0 && currentPlayer == null) {
          console.log('Nobody knows...');
          JeoSocket.emit('question_answered', {'currentScore': 0, 'currentPlayer': null, 'currentSid': null});
          $scope.currentScore = 0;
          $scope.currentPlayer = null;
          var answer = $scope.currentQuestion.answer;
          $scope.currentQuestion = null;
          $scope.showQuestionModal = false;
          JeoSocket.emit('question_active', false);
          if (answer){
            showAnswer(answer);
          }
      } else {
          console.log('Got the answer');
          var score = correct? questionScore : -1 * questionScore;
          //TODO: FixMe, make scope access consistent
          JeoSocket.emit('question_answered', {'currentScore': score, 'currentPlayer': currentPlayer,
                            'currentSid': $scope.currentSid});
          if (correct === true){
             $scope.showQuestionModal = false;
             $scope.currentQuestion = null;
             $scope.currentScore = 0;
             JeoSocket.emit('question_active', false);
          }
          $scope.currentSid = null;
          $scope.currentPlayer = null;
      }
    };

    $scope.login = (teamName) => {
      JeoSocket.emit('login', {'teamName': teamName});
      $scope.showLogin = false;
      $scope.teamName = teamName;
      $scope.isMainBoard = teamName == 'host';
      if (!$scope.isMainBoard){
        $scope.waitForStart = true;
        $scope.isPlayer = true;
      } else {
        $scope.showStartButton = true;
        $scope.isPlayer = false;
      }
    };

    $scope.startGame = () => {
      JeoSocket.emit('host_started_game', null);
      $scope.gameRunning = true;
      $scope.showStartButton = false;
    };

    $scope.push_button = () => {
      JeoSocket.emit('player_pushed_button', message='', (data) => {
        console.log('You have pushed the button!')
        console.log(data);
        // TODO: data == true if the player was the first
      });
    };
  });
})();
