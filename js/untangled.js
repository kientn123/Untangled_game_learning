var untangledGame = {
  circles: [],
  thinLineThickness: 1,
  boldLineThickness: 5,
  lines: [],
  currentLevel: 0,
  progressPercentage: 0
};

untangledGame.levels = 
[
  {
    'level': 0,
    'circles': [{'x': 400, 'y': 156},
                {'x': 381, 'y': 241},
                {'x': 84, 'y': 233},
                {'x': 88, 'y': 73}],
    'relationship': {
      '0': {'connectedPoints': [1, 2]},
      '1': {'connectedPoints': [0, 3]},
      '2': {'connectedPoints': [0, 3]},
      '3': {'connectedPoints': [1, 2]}
    }
  },
  {
    'level': 1,
    'circles': [{'x': 401, 'y': 73},
               {'x': 400, 'y': 240},
               {'x': 88, 'y': 241},
               {'x': 84, 'y': 72}],
    'relationship': {
      '0': {'connectedPoints': [1, 2, 3]},
      '1': {'connectedPoints': [0, 2, 3]},
      '2': {'connectedPoints': [0, 1, 3]},
      '3': {'connectedPoints': [0, 1, 2]}
    }
  },
  {
    'level': 2,
    'circles': [{'x': 92, 'y': 85},
               {'x': 253, 'y': 35},
               {'x': 393, 'y': 86},
               {'x': 390, 'y': 214},
               {'x': 248, 'y': 275},
               {'x': 95, 'y': 216}],
    'relationship': {
      '0': {'connectedPoints': [2, 3, 4]},
      '1': {'connectedPoints': [3, 5]},
      '2': {'connectedPoints': [0, 4, 5]},
      '3': {'connectedPoints': [0, 1, 5]},
      '4': {'connectedPoints': [0, 2]},
      '5': {'connectedPoints': [1, 2, 3]}
    }
  }
];

function setupCurrentLevel() {
  untangledGame.circles = [];
  var level = untangledGame.levels[untangledGame.currentLevel];
  for (var i=0; i<level.circles.length; i++) {
    untangledGame.circles.push(new Circle(level.circles[i].x, level.circles[i].y, 10));
  }
  connectCircles();
  updateLineIntersection();
}

function checkLevelCompleteness() {
  if ($('#progress').html() == '100') {
    if (untangledGame.currentLevel+1 < untangledGame.levels.length) {
      untangledGame.currentLevel++;
    }
    setupCurrentLevel();
  }
}

function Circle(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
}

function Line(startPoint, endPoint, thickness) {
  this.startPoint = startPoint;
  this.endPoint = endPoint;
  this.thickness = thickness;
}

function drawCircle(ctx, x, y, radius) {
  // ctx.fillStyle = "rgba(200, 200, 100, .6)";
  // prepare the radial gradients fill style
  var circle_gradient = ctx.createRadialGradient(x-3, y-3, 1, x, y, radius);
  circle_gradient.addColorStop(0, '#fff');
  circle_gradient.addColorStop(1, '#cc0');
  ctx.fillStyle = circle_gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function drawLine(ctx, x1, y1, x2, y2, thickness) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = thickness;
  ctx.strokeStyle = "#cfc";
  ctx.stroke();
}

function clear(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function connectCircles() {
  // connect the circles to each others with lines
  var level = untangledGame.levels[untangledGame.currentLevel];
  untangledGame.lines.length = 0;
  for (var i in level.relationship) {
    var connectedPoints = level.relationship[i].connectedPoints;
    var startPoint = untangledGame.circles[i];
    for (var j in connectedPoints) {
      var endPoint = untangledGame.circles[connectedPoints[j]];
      untangledGame.lines.push(new Line(startPoint, endPoint, untangledGame.thinLineThickness));
    }
  }
}

function gameloop() {
  // get the reference of the canvas element and the drawing context
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext('2d');
  // clear the canvas before redrawing
  clear(ctx);
  // draw the image background
  ctx.drawImage(untangledGame.background, 0, 0, ctx.canvas.width, ctx.canvas.height);
  // draw gradient background
  // var bg_gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  // bg_gradient.addColorStop(0, '#000000');
  // bg_gradient.addColorStop(1, '#555555');
  // ctx.fillStyle = bg_gradient;
  // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // draw all the remembered line
  for (var i=0; i<untangledGame.lines.length; i++) {
    var line = untangledGame.lines[i];
    var startPoint = line.startPoint;
    var endPoint = line.endPoint;
    var thickness = line.thickness;
    drawLine(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, thickness);
  }
  
  // draw all remembered circles
  for (var i=0; i<untangledGame.circles.length; i++) {
    var circle = untangledGame.circles[i];
    drawCircle(ctx, circle.x, circle.y, circle.radius);
  }
  
  ctx.font = '26px "Indie Flower"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';
  ctx.fillText('Untangled Game', ctx.canvas.width/2, 25);
  
  // draw the level progress text
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('Puzzle ' + untangledGame.currentLevel + ", Completeness: "
  + untangledGame.progressPercentage + "%", 50, ctx.canvas.height - 20);
}

function isIntersect(line1, line2) {
  // convert line1 to general form of line: Ax + By = C
  var a1 = line1.endPoint.y - line1.startPoint.y;
  var b1 = line1.startPoint.x - line1.endPoint.x;
  var c1 = a1 * line1.startPoint.x + b1 * line1.startPoint.y;
  // convert line2 to general form of line: Ax + By = C
  var a2 = line2.endPoint.y - line2.startPoint.y;
  var b2 = line2.startPoint.x - line2.endPoint.x;
  var c2 = a2 * line2.startPoint.x + b2 * line2.startPoint.y;
  
  // Calculate the intersection point
  var d = a1*b2 - a2*b1;
  
  // parallel when d is 0
  if (d == 0) {
    return false;
  }
  else {
    var x = (b2*c1 - b1*c2) / d;
    var y = (a1*c2 - a2*c1) / d;
    // check if the interception point is on both line segments
    if ((isInBetween(line1.startPoint.x, x, line1.endPoint.x) 
    || isInBetween(line1.startPoint.y, y, line1.endPoint.y)) 
    && (isInBetween(line2.startPoint.x, x, line2.endPoint.x)
    || isInBetween(line2.startPoint.y, y, line2.endPoint.y))) {
      return true;
    }
  }
  return false;
}

function isInBetween(a, b, c) {
  // return false if b is almost equal to a or c
  if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001) {
    return false;
  }
  // true when b is in between a and c
  return (a < b && b < c) || (c < b && b < a);
}

function updateLineIntersection() {
  // checking lines intersection and bold those lines
  for (var i=0; i<untangledGame.lines.length; i++) {
    for (var j=0; j<i; j++) {
      var line1 = untangledGame.lines[i];
      var line2 = untangledGame.lines[j];
      // we check if two lines are intersected and bold the lines if they are
      if (isIntersect(line1, line2)) {
        line1.thickness = untangledGame.boldLineThickness;
        line2.thickness = untangledGame.boldLineThickness;
      }
    }
  }
}

function updateLevelProgress() {
  // check the untangle progress of the level
  var progress = 0;
  for (var i=0; i<untangledGame.lines.length; i++) {
    if (untangledGame.lines[i].thickness == untangledGame.thinLineThickness) {
      progress++;
    }
  }
  var progressPercentage = Math.floor(progress/untangledGame.lines.length*100);
  $('#progress').html(progressPercentage);
  // display the current level
  $('#level').html(untangledGame.currentLevel);
}

$(function() {
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  var circleRadius = 10;
  var width = canvas.width;
  var height = canvas.height;
  
  setupCurrentLevel();
  // Random 5 circles
  // var circlesCount = 5;
  // for (var i=0; i<circlesCount; i++) {
    // var x = Math.random()*width;
    // var y = Math.random()*height;
    // circleRadius = Math.random()*7 + 10;
    // drawCircle(ctx, x, y, circleRadius);
    // untangledGame.circles.push(new Circle(x, y, circleRadius));
  // }
  
  // Add mouseEvent listerner to canvas
  $('#game').mousedown(function(e) {
    var canvasPosition = $(this).offset();
    var mouseX = e.offsetX || 0;
    var mouseY = e.offsetY || 0;
    
    for (var i=0; i<untangledGame.circles.length; i++) {
      var circleX = untangledGame.circles[i].x;
      var circleY = untangledGame.circles[i].y;
      var radius = untangledGame.circles[i].radius;
      
      if (Math.pow(mouseX-circleX, 2) + Math.pow(mouseY-circleY, 2) < Math.pow(radius, 2)) {
        untangledGame.targetCircle = i;
        break;
      }
    }
  });
  
  $('#game').mousemove(function(e) {
    if (untangledGame.targetCircle != undefined) {
      var canvasPosition = $(this).offset();
      var mouseX = e.offsetX || 0;
      var mouseY = e.offsetY || 0;
      var radius = untangledGame.circles[untangledGame.targetCircle].radius;
      untangledGame.circles[untangledGame.targetCircle] = new Circle(mouseX, mouseY, radius);
    }
    connectCircles();
    updateLineIntersection();
    updateLevelProgress();
  });
  
  $('#game').mouseup(function(e) {
    untangledGame.targetCircle = undefined;
    // on every mouse up, check if the untangle puzzle is solved
    checkLevelCompleteness();
  });
  
  var bg_gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  bg_gradient.addColorStop(0, '#ccc');
  bg_gradient.addColorStop(1, 'efefef');
  ctx.fillStyle = bg_gradient;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = "34px 'Indie Flower'";
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333';
  ctx.fillText("Loading...", ctx.canvas.width/2, ctx.canvas.height/2);
  // load the background image
  untangledGame.background = new Image();
  untangledGame.background.onload = function() {
      setInterval(gameloop, 30);
  };
  untangledGame.background.onerror = function() {
    consolo.log("error loading the image");
  };
  untangledGame.background.src = 'images/board.jpeg';
});
