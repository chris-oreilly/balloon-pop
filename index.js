var balloon = document.querySelector('.balloon');

// assume image is square
var width = 0.1 * Math.min(window.innerWidth, window.innerHeight);
var height = width;

// resize balloon and position it just below the visible area
TweenMax.set(balloon, {
  visibility: 'visible',
  width: width,
  height: height,
  x: (window.innerWidth - width * 1.5) * Math.random(),
  y: window.innerHeight,
});

// float steadily upward
TweenMax.to(balloon, 10, {
  y: -height,
  ease: Linear.easeNone,
  onComplete: function() {
    TweenMax.killTweensOf(balloon);
    document.body.removeChild(balloon);
  },
});

// gently wobble sideways
TweenMax.to(balloon, 2, {
  x: '+=' + width * 0.5,
  ease: Sine.easeInOut,
  repeat: -1,
  yoyoEase: true,
});
