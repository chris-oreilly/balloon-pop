var numBalloons = 0;
var maxBalloons = 10;

var numPopped = 0;
var counter = document.getElementById('counter');

var pop = new Howl({
  src: ['pop.webm', 'pop.mp3'],
  volume: 0.25,
});

// returns a quasi-random number generator based on the golden ratio
// idea borrowed from Martin Ankerl
// martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
function phiRandom() {
  var phi_conjugate = 0.6180339887498948;
  var seed = Math.random();
  return function() {
    seed = (seed + phi_conjugate) % 1;
    return seed;
  }
}

var randomHue = phiRandom();

function hsla(h, s, l, a) {
  return 'hsla(' +
    Math.round(h * 360) +
    ', ' + Math.round(s * 100) + '%' +
    ', ' + Math.round(l * 100) + '%' +
    ', ' + a +
    ')';
}

function addBalloon() {
  var balloon = document.createElement('canvas');
  balloon.width = balloon.height = 100;
  balloon.className = 'balloon';

  var ctx = balloon.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(50, 0);
  ctx.bezierCurveTo(80, 0, 88, 23, 88, 41);
  ctx.bezierCurveTo(88, 74, 51, 100, 50, 100);
  ctx.bezierCurveTo(50, 100, 14, 74, 14, 41);
  ctx.bezierCurveTo(14, 23, 22, 0, 50, 0);
  var hue = randomHue();
  var gradient = ctx.createRadialGradient(50, 40, 0, 50, 50, 50);
  gradient.addColorStop(0, hsla(hue, 1.0, 0.9, 0.8));
  gradient.addColorStop(1, hsla(hue, 1.0, 0.4, 0.9));
  ctx.fillStyle = gradient;
  ctx.fill();

  document.body.appendChild(balloon);

  var size = 0.2 * Math.min(window.screen.width, window.screen.height);

  var speed = Math.random() + 0.5 + Math.pow(numPopped / 100, 0.5);

  var floatTime = 10 / speed;
  var wobbleTime = 2;
  var wobbleDist = Math.min(size * 0.2 * speed, window.innerWidth - size);

  var x = (window.innerWidth - size - wobbleDist) * Math.random();
  var y = window.innerHeight;

  // resize balloon and position it just below the visible area
  TweenMax.set(balloon, {
    visibility: 'visible',
    width: size,
    height: size,
    x: x,
    y: y,
  });

  // float steadily upward
  TweenMax.to(balloon, 10 / speed, {
    y: -size,
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

setInterval(function() {
  if (numBalloons < maxBalloons)
    addBalloon();
}, 300);

function handleTap(event) {
  if (event.target.className === 'balloon') {
    pop.play();
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
