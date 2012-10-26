canvas = new Canvas("canvas");

X=0;
Y=1;
origin = [300,200];

filledPoly = new Polygon(origin[X],origin[Y]);
filledPoly.fillColor = "white";
filledPoly.color = "white";
canvas.add(filledPoly);

poly = new Polygon(origin[X],origin[Y]);
poly.color = "black";

outsideProfile = [50];
outsideRepeats = 20;
insideProfile = [10];
insideRepeats = 10;

steps=outsideRepeats*outsideProfile.length;
dRad = (Math.PI*2)/steps;

for(i=0;i<=steps;i++) {
  radius = outsideProfile[i%outsideProfile.length]-i*1.5;

  x = Math.sin(dRad*i)*radius*.8;
  y = Math.cos(dRad*i)*radius;
  poly.addPoint( x,y );
  filledPoly.addPoint( x,y );
}
canvas.add(poly);

steps=insideRepeats*insideProfile.length;
dRad = (Math.PI*2)/steps;

poly  = new Polygon(origin[X],origin[Y]);
for(i=steps;i>=0;i--) {
  radius = insideProfile[i%insideProfile.length];

  x = Math.sin(dRad*i)*radius;
  y = Math.cos(dRad*i)*radius;
  x-=5;
  y-=18;
  poly.addPoint( x,y );
  filledPoly.addPoint( x,y );
}
canvas.add(poly);

canvas.repaint();
println("Hello World");