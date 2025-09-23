document.addEventListener('DOMContentLoaded', function() {
  var button = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-links');

  if (button && menu) {
    // Toggle mobile navigation open/closed
    button.addEventListener('click', function() {
      var isOpen = menu.classList.toggle('open');
      button.classList.toggle('open');
      // Update ARIA attributes for accessibility
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      button.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });

    // Close the mobile menu when any link is clicked
    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('open');
        button.classList.remove('open');
        // Reset ARIA attributes when closing via link click
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Open menu');
        menu.setAttribute('aria-hidden', 'true');
      });
    });

    // Reset menu state on window resize (for switching back to desktop view)
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        menu.classList.remove('open');
        button.classList.remove('open');
        // Ensure ARIA attributes are reset on desktop
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Open menu');
        menu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Hero video play functionality (unchanged)
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
});
