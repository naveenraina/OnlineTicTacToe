'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl2', [function () {

  }])
  .controller('MyCtrl1', ["$scope", "$firebaseArray", '$rootScope', 'gameContext', 'firedb',
  function ($scope, $firebaseArray, $rootScope, gameContext, firedb) {
      initialize();

      var slideThroughButton = false;
      
      $scope.addUser = function () {
          if ($scope.currentUser.userName) {
              $scope.currentUser.userId = Math.floor(Math.random() * 9000) + 1000;
              firedb.addUser($scope.currentUser.userId, $scope.currentUser.userName);

              goToLevel(1);
              slideThroughButton = true;
          }          
      };

      $scope.startGame = function () {
          if ($scope.otherUser.otherUserId) {
              var ref = firedb.getFirebaseRoot().child('users');
              $firebaseArray(ref).$loaded()
                .then(function (list) {
                    var users = list;
                    var otherUser = _.where(users, { id: $scope.otherUser.otherUserId * 1 });
                    if (otherUser) {
                        $scope.otherUser.otherUserName = otherUser[0].name;
                        firedb.createGame({
                            id: $scope.currentUser.userId,
                            name: $scope.currentUser.userName,
                            symbol: 'X'
                        }, {
                            id: otherUser[0].id,
                            name: otherUser[0].name,
                            symbol: 'O'
                        }).then(function (data) {
                            
                            console.log("added game with id " + $scope.game.gameId);
                            $scope.game.gameId = data.ref.key();
                            gameContext.setGameContext({
                                gameId: $scope.game.gameId,
                                symbol: 'X'
                            });
                            $scope.gameBoard = data.game.board;
                            goToLevel(2);
                            slideThroughButton = true;
                                                    
                        });
                    }

                })
                .catch(function (error) {
                    console.log("Error:", error);
                });

          }
      }

      $scope.replay = function () {
          var ref = firedb.getFirebaseRoot().child('games');
          var games = $firebaseArray(ref);
          var gameObject = new Tictactoegame();

          games.$loaded().then(function (data) {
              var game = _.where(games, { $id: $scope.game.gameId })[0];                          
              game.board = gameObject.board;
              games.$save(game).then(function(){
                  $scope.gameBoard = gameObject.board;
                  $rootScope.$broadcast('makeMoveCalled', { result: 'Continue', board: $scope.gameBoard, winningCombination: [] });

              });                      
              
          });  
      }
      
      $scope.slideChanged = function (index) {
          //if (slideThroughButton === false) {
          //    $ionicSlideBoxDelegate.previous();
          //} else {
          //    slideThroughButton = false;
          //}
      };

      function initialize() {

          $scope.currentUser = {};
          $scope.otherUser = {};
          $scope.game = {isMyTurn: false};

          var ref = firedb.getFirebaseRoot().child('games');
          ref.on('child_changed', function (snapshot) {
              var response = snapshot.val();
              var userId = $scope.currentUser.userId;
              if (response.userA.id === userId || response.userB.id === userId) {
                  var gameId;
                  var context = gameContext.getGameContext();
                  if (context && context.gameId) {
                      gameId = context.gameId;
                  } else {
                      //game was initiated by other user
                      var games = $firebaseArray(ref);

                  }
                  var game = response.length ? response[gameId] : response;

                  $scope.otherUser.otherUserName = response.userA.id === userId ? response.userB.name : response.userA.name;

                  $scope.gameBoard = game.board;
                  if (game.board) {
                      var gameObject = new Tictactoegame();
                      gameObject.mergeCells(game.board);
                      var result = gameObject.getResult();
                      $rootScope.$broadcast('makeMoveCalled', { result: result, board: game.board, winningCombination: gameObject.winningCombination });
                      
                  } else {
                      $scope.gameOver = false;
                      $rootScope.$broadcast('makeMoveCalled', { result: 'Continue', board: game.board, winningCombination: [] });
                  }
              }

          });

          ref.on('child_added', function (snapshot) {
              var response = snapshot.val();
              var userId = $scope.currentUser.userId;
              if (response.userA.id === userId || response.userB.id === userId) {
                  
                $scope.otherUser.otherUserName = response.userA.id === userId ? response.userB.name : response.userA.name;
                goToLevel(2);
                                   
              }
          });
      }
      
      function goToNextLevel() {
          $scope.owl.next();          
      }

      function goToPreviousLevel() {
          $scope.owl.prev();          
      }

      function goToLevel(level) {
          $scope.owl.jumpTo(level);          
      }

  }]);