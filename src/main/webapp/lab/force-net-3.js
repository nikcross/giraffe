canvas = new Canvas("canvas");

X=0;
Y=1;
origin = [300,300];

function calculateNormal(x1,y1,x2,y2) {
  var dx = x2-x1;
  var dy = y2-y1;
  var length = calculateScalar(dx,dy);
  if(length==0) return [0,0];
  return [dy/length,-dx/length];
}

function calculateVector(x1,y1,x2,y2) {
  var dx = x2-x1;
  var dy = y2-y1;
  var length = calculateScalar(dx,dy);
  if(length==0) return [0,0];
  return [dx/length,dy/length];
}

function calculateScalar(x,y) {
  return Math.pow((x*x)+(y*y),0.5)
}



canvas.repaint();