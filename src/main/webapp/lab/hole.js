canvas = new Canvas("canvas");

width=600;
height=400;
centerX=300;
centerY=200;
radius=50;

poly  = new Polygon(0,0);
poly.setFillColor("white");
poly.setColor("white");
poly.addPoint(0,0);
poly.addPoint(width/2,0);
for(i=0;i<=360;i+=10) {
  rad = ((i+180)*Math.PI/180)%360;
  poly.addPoint((Math.sin(rad)*radius)+centerX,(Math.cos(rad)*radius)+centerY);
}
poly.addPoint(width/2,0);
poly.addPoint(width,0);
poly.addPoint(width,height);
poly.addPoint(0,height);

canvas.add(poly);
canvas.add(new Circle(centerX,centerY,radius));

canvas.repaint();