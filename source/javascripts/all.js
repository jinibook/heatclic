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
        window.user = response;
        startGame(response);
        fetchTaggableFriends();
      });
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  }, { scope: 'user_friends' });
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
  var increment = 80;
  var $mainCircle = $('#game-circle');

  var viewportWidth = $(window).width();
  var maxCircleWidth = viewportWidth * .5;

  $mainCircle.click(function() {
    clicks++;

    var size = $mainCircle.width();
    var newSize = size + increment;

    if (size >= maxCircleWidth) {
      showResults();
    } else {
      createPulseCircle(size);

      setTimeout(function() {
        $mainCircle.css({
          width: newSize,
          height: newSize,
        });
      }, 150);
    }
  });
}

function showResults() {
  var $mainCircle = $('#game-circle');
  var viewportWidth = $(window).width();
  var newSize = viewportWidth * 2;

  $mainCircle.css({
    transition: 'all 1.5s ease-in-out',
    width: newSize,
    height: newSize
  });

  setTimeout(function() {
    var randomFriends = [];
    for (var i=0; i < 4; i++) {
      var randomIndex = Math.floor(Math.random() * taggableFriends.length)
      randomFriends.push(taggableFriends[randomIndex]);
    }

    $('#results-page .js-friend').each(function(i, el) {
      var friend = randomFriends[i];
      if (friend) {
        $(el).find('img').prop('src', friend.picture.data.url);
      }
    })

    randomFriends.forEach(function(friend, i) {

    });

    $('#results-page').fadeIn();
  }, 500);
}

// Because Facebook is unlikely to allow us access to the taggable_friends
// permission, we can try this:
// User `user_photos` permission to fetch the list of albums, photos, and then
// tags in the photos. Find 4 photos where users who are not the current user ID
// are tagged... it will even give us x/y coordinates of the tag.
// https://developers.facebook.com/tools/explorer/1731066050465823?method=GET&path=1661845980181%2Ftags&version=v2.6

var taggableFriends = [];
function fetchTaggableFriends() {
  function fetch(path) {
    FB.api(path, function(response) {
      taggableFriends = taggableFriends.concat(response.data);

      if (response.paging.next) {
        fetch(response.paging.next);
      }
    });
  }

  fetch('/' + user.id + '/taggable_friends');
}
