(function(){
  var app = angular.module("app", []);
  app.controller("jeopardyController", function($scope) {
    $scope.categories = window.categories;
    $scope.costs = window.costs;

    $scope.getQuestion = function(category, cost){
      return $scope.questions.filter(function(q){
        return q.categoryId === category.id && q.cost === cost;
      })[0].question;
    }
  });
})();
