canvas = new Canvas("canvas");

now=14;

horizon = new Composite(0,0);
for(i=0;i<=180;i+=10) {
  x = Math.sin((i-90)*Math.PI/180)*300;
  y = Math.cos((i-90)*Math.PI/180)*300;

  horizon.add( new Line(300,200,x,y) );
}
canvas.add(horizon);

sunPath = new Composite(0,0);
sun = new Circle(0,0,10).setColor("orange").setFillColor("yellow");
traceSummer = new Polyline(0,0).setColor("green");
traceWinter = new Polyline(0,0).setColor("blue");
traceNow = new Polyline(0,0).setColor("red");
for(i=0;i<600;i+=10) {
  orientation = (i/600)*(Math.PI*2);
  time = Math.round( (i/600)*24 );

  x = i*2;
  ySummer = 200+(Math.sin(orientation)*150);
  yNow = 200+(Math.sin(orientation)*100);
  yWinter = 200+(Math.sin(orientation)*50);

  traceSummer.addPoint(x,ySummer);
  traceNow.addPoint(x,yNow);
  traceWinter.addPoint(x,yWinter);

  if(time==now) {
    sun.x=x;
    sun.y=yNow;
  }
}

sunPath.add(traceSummer);
sunPath.add(traceWinter);
sunPath.add(traceNow);
sunPath.add(sun);
sunPath.x = -250;

canvas.add(sunPath);

canvas.repaint();