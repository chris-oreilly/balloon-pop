var numBalloons = 0;
var maxBalloons = 10;

var numPopped = 0;
var counter = document.getElementById('counter');

function addBalloon() {
  var balloon = document.createElement('img');
  balloon.className = 'balloon';
  balloon.src = 'balloon.svg';

  document.body.appendChild(balloon);

  // assume image is square
  var width = 0.2 * Math.min(window.screen.width, window.screen.height);
  var height = width;

  var speed = Math.random() + 0.5 + numPopped / 100;

  var floatTime = 10 / speed;
  var wobbleTime = 2;
  var wobbleDist = Math.min(width * 0.2 * speed, window.innerWidth - width);

  var x = (window.innerWidth - width - wobbleDist) * Math.random();
  var y = window.innerHeight;

  // resize balloon and position it just below the visible area
  TweenMax.set(balloon, {
    visibility: 'visible',
    width: width,
    height: height,
    x: x,
    y: y,
  });

  // float steadily upward
  TweenMax.to(balloon, 10 / speed, {
    y: -height,
    ease: Linear.easeNone,
    onComplete: removeBalloon,
    onCompleteParams: [balloon],
  });

  // gently wobble sideways
  TweenMax.to(balloon, wobbleTime, {
    x: '+=' + wobbleDist,
    ease: Sine.easeInOut,
    repeat: -1,
    yoyoEase: true,
  }).seek(wobbleTime * Math.random());

  numBalloons++;
}

function removeBalloon(balloon) {
  TweenMax.killTweensOf(balloon);
  document.body.removeChild(balloon);

  numBalloons--;
}

TweenMax.ticker.addEventListener('tick', function() {
  // the fewer balloon on screen, the greater the chance to add more
  var chance = 0.05 * Math.pow((maxBalloons - numBalloons) / maxBalloons, 0.5);
  if (Math.random() < chance)
    addBalloon();
});

function handleTap(event) {
  if (event.target.tagName === 'IMG') {
    removeBalloon(event.target);
    numPopped++;
    counter.innerHTML = numPopped;
  }
  event.preventDefault();
}

document.addEventListener('touchstart', handleTap);
document.addEventListener('mousedown', handleTap);

function disableMouseEvents() {
  document.removeEventListener('mousedown', handleTap);
  // this function only needs to run once
  document.removeEventListener('touchstart', disableMouseEvents);
}

document.addEventListener('touchstart', disableMouseEvents);
