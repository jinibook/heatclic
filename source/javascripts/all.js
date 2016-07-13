//= require jquery

$(function() {
  displayHomepage()

  $('.js-login').click(login);

  $('.js-pick-weapon').click(pickWeapon);

  initMainCircle();
});

function login(event) {
  event.preventDefault();

  FB.login(function(response) {
    if (response.authResponse) {
      FB.api('/me', function(response) {
        startGame(response);
      });
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  });
}

function pickWeapon(event) {
  event.preventDefault();
  var weapon = $(this).data('weapon');
  playGameWithWeapon(weapon);
}

function displayHomepage() {
  $('#home-page').show();
  $('#pick-weapon-page, #game-page, #results-page').hide();
}

function startGame(user) {
  $('#home-page').hide();

  $('#pick-weapon-page .js-user-name').text(user.name);
  $('#pick-weapon-page').show();
}

function playGameWithWeapon(weapon) {
  $('#pick-weapon-page').hide();

  $('#game-page .js-weapon').text(weapon)
  $('#game-page').show()
}

function createPulseCircle(initialSize) {
  var $circle = $('<div class="pulse-circle"></div>');
  $circle.css({
    width: initialSize,
    height: initialSize
  });

  $('#game-page').append($circle);
  $circle[0].offsetHeight;

  $circle.css({
    width: 2000,
    height: 2000,
    opacity: 0
  });
}

function initMainCircle() {
  var clicks = 0;
  var increment = 40;
  var $mainCircle = $('#game-circle');

  $mainCircle.click(function() {
    clicks++;

    var size = $mainCircle.width();
    var newSize = size + increment;

    createPulseCircle(size);

    setTimeout(function() {
      $mainCircle.css({
        width: newSize,
        height: newSize,
      });
    }, 100);
  });
}
