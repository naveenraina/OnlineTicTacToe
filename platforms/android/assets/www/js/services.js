'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1').

    factory('gameContext', function () {
        var context;        
        function setGameContext(value) {
            context = value
        }

        function getGameContext() {
            return context;
        }

        return {
            setGameContext: setGameContext,
            getGameContext: getGameContext
        }
    }).

factory('ticTacToeHubService', ['$firebaseArray', '$q', 'firedb', function ($firebaseArray, $q, firedb) {
    return {
        makeMove: makeMove,
        getGameId: getGameId
    }

    function makeMove(gameId, row, col, userId) {
        var defer = $q.defer();
        var ref = firedb.getFirebaseRoot().child('games');
        var games = $firebaseArray(ref);

        games.$loaded().then(function (data) {
            var game = _.where(games, { $id: gameId })[0];

            var gameObject = new Tictactoegame();
            gameObject.mergeCells(game.board);

            var symbol = game.userA.id === userId ? game.userA.symbol : game.userB.symbol;

            var result = gameObject.makeMove(row, col, symbol);
            game.board = gameObject.board;

            games.$save(game);
            defer.resolve({ result: result, board: game.board, winningCombination: gameObject.winningCombination });
        }).catch(function (error) {
            defer.reject(error);
        });

        return defer.promise;

    }

    function getGameId(userId) {
        var defer = $q.defer();
        var ref = firedb.getFirebaseRoot().child('games');
        var games = $firebaseArray(ref);

        games.$loaded().then(function (data) {
            var game = _.find(games, function (obj) {
                return obj.userA.id === userId || obj.userB.id === userId;
            });

            defer.resolve(games.$keyAt(game));
        }).catch(function (error) {
            defer.reject(error);
        });

        return defer.promise;
    }

}])

.factory('firedb', ['$firebaseArray', 'gameContext', '$q', function ($firebaseArray, gameContext, $q) {

    var root;

    return {
        addUser: addUser,
        getFirebaseRoot: getFirebaseRoot,
        createGame: createGame

    }

    function addUser(userId, userName) {
        var ref = getFirebaseRoot().child('users');
        var users = $firebaseArray(ref);

        var user = {
            id: userId,
            name: userName
        };

        users.$add({
            id: userId,
            name: userName
        });
    };

    function createGame(userA, userB) {
        var defer = $q.defer();

        var ref = getFirebaseRoot().child("games");
        var games = $firebaseArray(ref);
        var game = new Tictactoegame();
        games.$add({
            userA: userA,
            userB: userB,
            gameBoard: game.board
        }).then(function (ref) {
            defer.resolve({
                ref: ref,
                game: game
            });
        });

        return defer.promise;
    }

    function getFirebaseRoot() {
        if (!root) {
            root = new Firebase("https://sizzling-torch-4930.firebaseIO.com");
        }        
        return root;
    }

}
]);
