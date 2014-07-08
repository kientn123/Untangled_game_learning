var untangledGame = {
  circles: [],
  thinLineThickness: 1,
  lines: []
};

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
  ctx.fillStyle = "rgba(200, 200, 100, .6)";
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
  untangledGame.lines.length = 0;
  for (var i=0; i<untangledGame.circles.length; i++) {
    var startPoint = untangledGame.circles[i];
    for (var j=0; j<i; j++) {
      var endPoint = untangledGame.circles[j];
      // drawLine(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, untangledGame.thinLineThickness);
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
}

$(function() {
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  var circleRadius = 10;
  var width = canvas.width;
  var height = canvas.height;
  
  // Random 5 circles
  var circlesCount = 5;
  for (var i=0; i<circlesCount; i++) {
    var x = Math.random()*width;
    var y = Math.random()*height;
    circleRadius = Math.random()*7 + 10;
    drawCircle(ctx, x, y, circleRadius);
    untangledGame.circles.push(new Circle(x, y, circleRadius));
  }
  
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
  });
  
  $('#game').mouseup(function(e) {
    untangledGame.targetCircle = undefined;
  });
  
  // setup an interval to loop the game 
  setInterval(gameloop, 30);
});
