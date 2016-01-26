'use strict';

;

(function () {

  /**
   * Randomize array element order in-place.
   * Durstenfeld shuffle algorithm.   
   */
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  var selected1 = undefined,
      selected2 = undefined;

  // http://unicode.org/emoji/charts/full-emoji-list.html
  var icons = ['🐵', '🐶', '🐺', '🐱', '🐯', '🐴', '🐮', '🐷', '🐗', '🐭', '🐹', '🐰', '🐻', '🐨', '🐼', '🐔', '🐤', '🐦', '🐧', '🐸', '🐲'];

  var app = angular
  // Using ngTouch to remove the 300ms click delay on mobile devices
  .module('app', ['ngRoute', 'ngAnimate', 'ngTouch']).controller('appController', function ($scope, $timeout, $animate) {

    $timeout(function () {
      $scope.appReady = true;
    });

    function showAllCards() {
      $scope.list.forEach(function (card) {
        $("#card-" + card.id).flip(true);
      });
    }

    function startNewGame() {

      shuffleArray(icons);

      selected1 = selected2 = null;

      $animate.enabled(false);

      var list = [],
          cardCount = 16;
      for (var i = 1; i <= cardCount; i++) {
        var type = i % (cardCount / 2) + 1;
        list.push({
          id: i,
          type: type,
          icon: icons[type - 1],
          theme: 'theme' + type,
          isKnown: false
        });
      }

      shuffleArray(list);

      $scope.clickCount = 0;
      $scope.list = list;
      $scope.cardsLeft = list.length;
      $scope.appReady = false;

      $timeout(function () {
        // Angular DOM has finished rendering
        $animate.enabled(true);

        var $card = $(".app__cards-container__card");
        $card.flip({
          axis: 'y',
          trigger: 'manual',
          reverse: true
        }, function () {
          //callback
        });

        //showAllCards(); // debug
      });
    }

    $scope.clickCount = 0;
    $scope.cardsLeft = 0;
    $scope.gameCompleted = false;
    $scope.restart = function () {
      startNewGame();
      $scope.gameCompleted = false;
    };

    startNewGame();

    $scope.click = function (card, index) {

      if (card.flipped) return;

      $scope.clickCount++;

      card.flipped = true;

      $("#card-" + card.id).flip(true);

      selected2 = selected1;
      selected1 = card;

      if (selected1 && selected2 && selected1.type == selected2.type) {

        $timeout(function () {
          $scope.list.splice($scope.list.indexOf(selected1), 1);
          $scope.list.splice($scope.list.indexOf(selected2), 1);
          selected1 = selected2 = null;

          $scope.cardsLeft = $scope.list.length;

          if ($scope.list.length === 0) {
            // We have finished the game
            $scope.gameCompleted = true;
          }
        }, 100);

        return;
      }

      if (selected2) {
        (function () {

          // Flip back the 2nd shown card

          var id = selected2.id;
          $timeout(function () {
            $scope.list.forEach(function (card) {
              if (card.id === id) {
                card.flipped = false;
                card.isKnown = true;
              }
            });
            $("#card-" + id).flip(false);
          }, 700);
        })();
      }
    };
  });
})();