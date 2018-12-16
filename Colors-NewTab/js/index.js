//-------------------------------------
// Letters
//-------------------------------------
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var grd,
  keys_down = [],
  letters = [];

var symbols = [
  { k: 81, s: "q", x: 5 },
  { k: 87, s: "w", x: 15 },
  { k: 69, s: "e", x: 25 },
  { k: 82, s: "r", x: 35 },
  { k: 84, s: "t", x: 45 },
  { k: 89, s: "y", x: 55 },
  { k: 85, s: "u", x: 65 },
  { k: 73, s: "i", x: 75 },
  { k: 79, s: "o", x: 85 },
  { k: 80, s: "p", x: 95 },
  { k: 65, s: "a", x: 10 },
  { k: 83, s: "s", x: 20 },
  { k: 68, s: "d", x: 30 },
  { k: 70, s: "f", x: 40 },
  { k: 71, s: "g", x: 50 },
  { k: 72, s: "h", x: 60 },
  { k: 74, s: "j", x: 70 },
  { k: 75, s: "k", x: 80 },
  { k: 76, s: "l", x: 90 },
  { k: 90, s: "z", x: 20 },
  { k: 88, s: "x", x: 30 },
  { k: 67, s: "c", x: 40 },
  { k: 86, s: "v", x: 50 },
  { k: 66, s: "b", x: 60 },
  { k: 78, s: "n", x: 70 },
  { k: 77, s: "m", x: 80 },
  { k: 48, s: "0", x: 90 },
  { k: 49, s: "1", x: 0 },
  { k: 50, s: "2", x: 10 },
  { k: 51, s: "3", x: 20 },
  { k: 52, s: "4", x: 30 },
  { k: 53, s: "5", x: 40 },
  { k: 54, s: "6", x: 50 },
  { k: 55, s: "7", x: 60 },
  { k: 56, s: "8", x: 70 },
  { k: 57, s: "9", x: 80 }
];

function Letter(key) {
  this.x = findX(key);
  this.symbol = findS(key);
  this.number = Math.floor(Math.random() * 255 + 1);
  this.color = "hsl( " + this.number + ", 100%, 50% ";
  this.size = Math.floor(Math.random() * 60 + 12);
  this.path = getRandomPath(this.x);
  this.rotate = Math.floor(Math.random() * Math.PI + 1);
  this.percent = 0;
}

Letter.prototype.draw = function() {
  var percent = this.percent / 100;
  var xy = getQuadraticBezierXYatPercent(
    this.path[0],
    this.path[1],
    this.path[2],
    percent
  );
  ctx.save();
  ctx.translate(xy.x, xy.y);
  ctx.rotate(this.rotate);
  ctx.font = this.size + "px Roboto";
  ctx.fillStyle = this.color;
  ctx.fillText(this.symbol, -15, -15);
  ctx.restore();
};

Letter.prototype.drawPath = function() {
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(this.path[0].x, this.path[0].y);
  ctx.quadraticCurveTo(
    this.path[1].x,
    this.path[1].y,
    this.path[2].x,
    this.path[2].y
  );
  ctx.stroke();
};

function findX(key) {
  for (var i = 0; i < symbols.length; i++) {
    if (symbols[i].k == key) {
      return symbols[i].x * canvas.width / 100;
    }
  }
  return false;
}

function findS(key) {
  for (var i = 0; i < symbols.length; i++) {
    if (symbols[i].k == key) {
      return symbols[i].s;
    }
  }
  return false;
}

function getRandomPath(x) {
  var x_start = x;
  var x_end = x_start + Math.floor(Math.random() * 400 - 199);

  return [
    {
      x: x_start,
      y: canvas.height
    },
    {
      x: (x_start + x_end) / 2,
      y: Math.floor(Math.random() * canvas.height - canvas.height)
    },
    {
      x: x_end,
      y: canvas.height
    }
  ];
}

function drawBackground() {
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
  var x =
    Math.pow(1 - percent, 2) * startPt.x +
    2 * (1 - percent) * percent * controlPt.x +
    Math.pow(percent, 2) * endPt.x;
  var y =
    Math.pow(1 - percent, 2) * startPt.y +
    2 * (1 - percent) * percent * controlPt.y +
    Math.pow(percent, 2) * endPt.y;
  return { x: x, y: y };
}

function resize() {
  var box = canvas.getBoundingClientRect();
  canvas.width = box.width;
  canvas.height = box.height;
  grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
  //grd.addColorStop(0,"#ffffff");
  //grd.addColorStop(1,"#bce2e9");
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  for (var i = 0; i < letters.length; i++) {
    letters[i].percent += 1;
    letters[i].draw();
    // letters[i].drawPath();
    if (letters[i].percent > 100) {
      letters.splice(i, 1);
    }
  }

  for (var i = 0; i < keys_down.length; i++) {
    if (keys_down[i]) {
      letters.push(new Letter(i));
    }
  }
  requestAnimationFrame(draw);
}
var start_keys = []; //81, 87, 69, 82, 84, 89, 85, 73, 79, 80

function startAnimation() {
  setTimeout(function() {
    var key = start_keys.pop();
    keys_down[key] = true;
    setTimeout(function() {
      keys_down[key] = false;
    }, 180);
    if (start_keys.length > 0) {
      startAnimation();
    }
  }, 180);
}
resize();
draw();
startAnimation();

window.onresize = resize;

document.getElementById("input").onkeyup = function(event) {
  keys_down[event.keyCode] = false;
};

document.getElementById("input").onkeydown = function(event) {
  if (event.keyCode == 91 && event.keyCode == 224) {
    keys_down = [];
  } else if (
    (event.keyCode >= 65 && event.keyCode <= 90) ||
    (event.keyCode >= 48 && event.keyCode <= 57)
  ) {
    keys_down[event.keyCode] = true;
  }
};

//document.getElementById("input").focus();

window.requestAnimationFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

//-----------------------------------
// Clock / Search Bar
//------------------------------------

var input = document.getElementById("input");
var button = document.getElementById("button");
var icon = document.getElementById("icon");
var wrapper = document.getElementById("wrapper");
var clockFrame = document.getElementsByClassName("clock");
var inputValue = input.value;
var google = "https://www.google.com/search?q=";
var state = 0;

// Clock
function clock() {
  if (state === 0) {
    var t = moment(),
      a = t.minutes() * 6,
      o = (t.hours() % 12) / 12 * 360 + a / 12;
    $(".hour").css("transform", "rotate(" + o + "deg)");
    $(".minute").css("transform", "rotate(" + a + "deg)");
  }
}
function refreshClock() {
  clock(), setTimeout(refreshClock, 1000);
}
refreshClock();

$("#button").mouseenter(function() {
  // Opening
  if (state === 0) {
    state = 1;
    button.style.width = "600px";
    button.style.height = "150px";
    button.style.WebkitAnimationPlayState = "paused";
    button.style.animationPlayState = "paused";
    $(".clock").addClass("open");
    $(".hour").css("transform", "");
    $(".hour").addClass("open");
    $(".minute").css("transform", "");
    $(".minute").addClass("open");
    $("#input").css("width", "370px");
  }
});

$("#button").mouseleave(function() {
  // Closing
  if (state === 1) {
    state = 0;
    button.style.width = null;
    button.style.height = null;
    button.style.WebkitAnimationPlayState = null;
    button.style.animationPlayState = null;
    $("#input").css("width", "0");
    $(".clock").removeClass("open");
    $(".hour").removeClass("open");
    $(".minute").removeClass("open");
    refreshClock();
  }
});

input.onfocus = function() {
  state = 2;
  button.style.width = "600px";
  button.style.height = "150px";
  button.style.WebkitAnimationPlayState = "paused";
  button.style.animationPlayState = "paused";
};

input.onblur = function() {
  state = 0;
  button.style.width = null;
  button.style.height = null;
  button.style.WebkitAnimationPlayState = null;
  button.style.animationPlayState = null;
  $("#input").css("width", "0");
  $(".clock").removeClass("open");
  $(".hour").removeClass("open");
  $(".minute").removeClass("open");
  refreshClock();
};

// Search Google - NO TRACKING!!!!! 
input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
     window.location = google + escape(input.value);
  }
});