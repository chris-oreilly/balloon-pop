var numBalloons = 0;
var maxBalloons = 10;

var numPopped = 0;
var counter = document.getElementById('counter');

var pop = new Howl({
  src: ['sounds/pop.webm', 'sounds/pop.mp3'],
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

function drawBalloon(canvas) {
  canvas.width = 70;
  canvas.height = 100;

  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(35, 0);
  ctx.bezierCurveTo(62, 0, 70, 22, 70, 40);
  ctx.bezierCurveTo(70, 75, 35, 100, 35, 100);
  ctx.bezierCurveTo(35, 100, 0, 75, 0, 40);
  ctx.bezierCurveTo(0, 22, 8, 0, 35, 0);

  var hue = randomHue();
  var gradient = ctx.createRadialGradient(45, 30, 0, 50, 50, 50);
  gradient.addColorStop(0, hsla(hue, 1.0, 0.9, 0.8));
  gradient.addColorStop(1, hsla(hue, 1.0, 0.4, 0.9));
  ctx.fillStyle = gradient;
  ctx.fill();
}

function animateBalloon(elem) {
  var size = 0.2 * Math.min(window.screen.width, window.screen.height);

  var speed = Math.random() + 0.5 + Math.pow(numPopped / 100, 0.5);

  var floatTime = 10 / speed;
  var wobbleTime = 2;
  var wobbleDist = Math.min(size * 0.2 * speed, window.innerWidth - size);

  var x = (window.innerWidth - size - wobbleDist) * Math.random();
  var y = window.innerHeight;

  // resize balloon and position it just below the visible area
  TweenMax.set(elem, {
    visibility: 'visible',
    transformOrigin: 'left top',
    scale: size / elem.height,
    x: x,
    y: y,
  });

  // float steadily upward
  TweenMax.to(elem, 10 / speed, {
    y: -size,
    ease: Linear.easeNone,
    onComplete: removeBalloon,
    onCompleteParams: [elem],
  });

  // gently wobble sideways
  TweenMax.to(elem, wobbleTime, {
    x: '+=' + wobbleDist,
    ease: Sine.easeInOut,
    repeat: -1,
    yoyoEase: true,
  }).seek(wobbleTime * Math.random());
}

function addBalloon() {
  var balloon = document.createElement('canvas');
  balloon.className = 'balloon';
  drawBalloon(balloon);
  document.body.appendChild(balloon);
  animateBalloon(balloon);
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

var mask = document.createElement('canvas');
drawBalloon(mask);
var ctx = mask.getContext('2d');
var maskData = ctx.getImageData(0, 0, mask.width, mask.height);

function handleTap(event) {
  if (event.target.className === 'balloon') {
    var balloon = event.target;
    var x = Math.round((event.clientX - balloon._gsTransform.x) / balloon._gsTransform.scaleX);
    var y = Math.round((event.clientY - balloon._gsTransform.y) / balloon._gsTransform.scaleY);
    // get alpha channel of pixel at (x, y)
    var idx = ((x * 4) + (y * maskData.width * 4)) + 3;
    if (maskData.data[idx]) {
      pop.play();
      removeBalloon(event.target);
      numPopped++;
      counter.innerHTML = numPopped;
    }
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
