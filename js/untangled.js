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
  this.endPoitn = endPoint;
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
  
  for (var i=0; i<untangledGame.circles.length; i++) {
    var startPoint = untangledGame.circles[i];
    for (var j=0; j<i; j++) {
      var endPoint = untangledGame.circles[j];
      drawLine(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, untangledGame.thinLineThickness);
      untangledGame.lines.push(new Line(startPoint, endPoint, untangledGame.thinLineThickness));
    }
  }
});
