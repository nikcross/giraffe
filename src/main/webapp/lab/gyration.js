function Arc(x,y,startAngle,sweepAngle,radius)
{
  this.x=x;
  this.y=y;
  this.startAngle=startAngle;
  this.sweepAngle=sweepAngle;
  this.radius=radius;
  this.draw = function()
  {
    this.canvas.beginPath();
    if(this.fillColor!=null)
    {
      this.canvas.fillStyle = this.fillColor;
    }
    var startAngleRad = this.startAngle*2*Math.PI/360;
    var sweepAngleRad = ((this.startAngle+this.sweepAngle)%360)*2*Math.PI/360;

    this.canvas.strokeStyle = this.color;
    this.canvas.moveTo(0,0);
    this.canvas.lineTo(
      Math.cos(startAngleRad)*radius,
      Math.sin(startAngleRad)*radius
    );
    this.canvas.arc(0,0,this.radius,startAngleRad,sweepAngleRad,false);
    this.canvas.lineTo( 0,0 );
    this.canvas.closePath()
    if(this.fillColor!=null)
    {
      this.canvas.fill();
    }
    this.canvas.stroke();
  }

  this.setColor = function(color) {
    this.color = color;
    return this;
  }
  this.setFillColor = function(fillColor) {
    this.fillColor= fillColor;
    return this;
  }
}
Arc.prototype = new GraphicsObject();

canvas = new Canvas("canvas");

composite = new Composite(400,240,0);
canvas.add(composite);

circle = new Circle(0,0,30,30);
circle.setFillColor("blue");
composite.add(circle);

arrow = new Composite(0,0,0);
composite.add(arrow);
poly = new Polygon(0,20);
poly.addPoint(0,0);
poly.addPoint(15,0);
poly.addPoint(10,20);
poly.addPoint(20,20);
poly.addPoint(0,30);
poly.addPoint(-20,20);
poly.addPoint(-10,20);
poly.addPoint(-15,0);
poly.setFillColor("yellow");
poly.setColor("grey");
arrow.add( poly );

arrow2 = new Composite(0,0,90*Math.PI/180);
poly2 = new Polygon(0,20);
poly2.points = poly.points;
poly2.setFillColor("yellow");
poly2.setColor("grey");
arrow2.add(poly2);
composite.add(arrow2);

arrow3 = new Composite(0,0,180*Math.PI/180);
poly3 = new Polygon(0,20);
poly3.points = poly.points;
poly3.setFillColor("yellow");
poly3.setColor("grey");
arrow3.add(poly3);
composite.add(arrow3);

arrow4 = new Composite(0,0,270*Math.PI/180);
poly4 = new Polygon(0,20);
poly4.points = poly.points;
poly4.setFillColor("yellow");
poly4.setColor("grey");
arrow4.add(poly4);
composite.add(arrow4);

curve = new Polygon(0,0);
composite.add(curve);
for(i=0.6;i<1;i+=0.1) {
  dx = Math.sin(i)*50;
  dy = Math.cos(i)*50;
  curve.addPoint(dx,dy);
}
i-=0.1;
for(;i>=0.6;i-=0.1) {
  dx = Math.sin(i)*60;
  dy = Math.cos(i)*60;
  curve.addPoint(dx,dy);
}
  dx = Math.sin(i+0.1)*65;
  dy = Math.cos(i+0.1)*65;
curve.addPoint(dx,dy);
  dx = Math.sin(i)*55;
  dy = Math.cos(i)*55;
curve.addPoint(dx,dy);
  dx = Math.sin(i+0.1)*45;
  dy = Math.cos(i+0.1)*45;
curve.addPoint(dx,dy);
curve.setFillColor("yellow");
curve.setColor("grey");

curve2 = new Polygon(0,0);
curve2.points = curve.points
curve2.setFillColor("yellow");
curve2.setColor("grey");
curve2.scaleX=-1;
composite.add(curve2);

curve3 = new Polygon(0,0);
curve3.points = curve.points
curve3.setFillColor("yellow");
curve3.setColor("grey");
curve3.scaleY=-1;
curve3.scaleX=-1;
composite.add(curve3);

curve4 = new Polygon(0,0);
curve4.points = curve.points
curve4.setFillColor("yellow");
curve4.setColor("grey");
curve4.scaleY=-1;
composite.add(curve4);

arc = new Arc(700,60,270,-70,50);
arc.setFillColor("green");
canvas.add(arc);

text = new Text(-18,5,"101",15);
text.setColor("red");
composite.add(text);

composite.scaleX=3.5;
composite.scaleY=3.5;
composite.rotation=0;

canvas.repaint();