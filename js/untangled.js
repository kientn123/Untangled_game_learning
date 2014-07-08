var untangledGame = {};

function drawCircle(ctx, x, y, radius) {
  ctx.fillStyle = "rgba(200, 200, 100, .6)";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}
$(function() {
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(200, 200, 100, .6)";
  ctx.beginPath();
  ctx.arc(100, 110, 50, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  
  // draw top half circle
  ctx.beginPath();
  ctx.arc(100, 90, 50, 0, Math.PI, true);
  ctx.closePath();
  ctx.fill();
  
  // draw left halft circle
  ctx.beginPath();
  ctx.arc(250, 100, 50, Math.PI*3/2, Math.PI/2);
  //ctx.closePath();
  ctx.fill();
});
