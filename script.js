document.addEventListener('DOMContentLoaded', function() {
  var button = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-links');
  
  if (button && menu) {
    button.addEventListener('click', function() {
      menu.classList.toggle('open');
      button.classList.toggle('open');
    });
  }

  // Hero video functionality  
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    var attemptPlay = function() {
      var promise = heroVideo.play();
      if (promise !== undefined) {
        promise.catch(function() {});
      }
    };
    attemptPlay();
    var playOnClick = function() {
      attemptPlay();
      document.removeEventListener('click', playOnClick);
      document.removeEventListener('touchstart', playOnClick);
    };
    document.addEventListener('click', playOnClick);
    document.addEventListener('touchstart', playOnClick);
  }
  
  // Anchor scrolling
  function scrollToAnchor(hash) {
    if (!hash) return;
    var targetId = hash.replace('#', '');
    var target = document.getElementById(targetId);
    if (target) {
      setTimeout(function() {
        var headerOffset = 140;
        var targetPosition = target.offsetTop - headerOffset;
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
      }, 100);
    }
  }
  
  if (window.location.hash) {
    scrollToAnchor(window.location.hash);
  }
  
  window.addEventListener('hashchange', function() {
    scrollToAnchor(window.location.hash);
  });
});
