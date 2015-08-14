'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function (version) {
      return function (scope, elm, attrs) {
          elm.text(version);
      };
  }])
.directive('gameTile', ['$rootScope', 'ticTacToeHubService', gameTile])
.directive('owlCarousel', owlCarousel);

function gameTile($rootScope, ticTacToeHubService) {

    return {
        link: linker
    };

    function linker(scope, element, attrs) {
        var information = scope.$eval(attrs.gameTile);
        var row = information[0];
        var column = information[1];
        scope.gameOver = false;

        element.click(function () {
            if (scope.gameBoard && scope.gameBoard[row] && scope.gameBoard[row][column]) {
                var currentValue = scope.gameBoard[row][column];
                if (currentValue === 'X' ||
                    currentValue === 'O' ||
                    scope.gameOver === true) {
                    return;
                }
            }

            if (!scope.game.gameId) {
                ticTacToeHubService.getGameId(scope.currentUser.userId)
                    .then(function (gameId) {
                        scope.game.gameId = gameId;
                        makeMove(gameId, row, column);
                    })
            } else {
                makeMove(scope.game.gameId, row, column);
            }

        });

        function makeMove(gameId, row, column) {
            ticTacToeHubService.makeMove(gameId, row, column, scope.currentUser.userId)
                .then(function (response) {
                    processResponse(response, false);
                });
        }

        $rootScope.$on('makeMoveCalled', function (event, response) {
            processResponse(response, true);
        });

        function processResponse(response, isCallback) {
            scope.gameBoard = response.board;
            scope.winningCombination = response.winningCombination;
            if (response.result === 'Won' || response.result === 'Draw' || response.result === 'Lost') {
                scope.gameOver = true;
                var responsetemp = response;
                if (isCallback && response.result === 'Won') {
                    responsetemp.result = 'Lost';
                    scope.game.ticTacToeResponseType = 'Lost';
                }

                if (responsetemp.result === 'Draw') {
                    scope.gameResult = 'Game is Draw';
                    scope.game.ticTacToeResponseType = 'Draw';
                } else {
                    scope.gameResult = 'You ' + responsetemp.result;
                    scope.game.ticTacToeResponseType = responsetemp.result;
                }

            } else {
                scope.gameOver = false;
            }
        }

        function broadcastGameEndedEvent(state) {

            $rootScope.$broadcast('gameEnded', state);
        }

    }
}

function owlCarousel() {
    return {
        link: linker
    };

    function linker(scope, element, attrs) {
        element.owlCarousel({

            navigation : false,
            slideSpeed : 300,
            paginationSpeed : 400,
            singleItem : true

            // "singleItem:true" is a shortcut for:
            // items : 1, 
            // itemsDesktop : false,
            // itemsDesktopSmall : false,
            // itemsTablet: false,
            // itemsMobile : false

        });

        scope.owl = element.data('owlCarousel');
    }
}
