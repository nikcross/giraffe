canvas = new Canvas("canvas");
//canvas.add(new Rectangle(0,0,480,800).setFillColor("black"));
	 foregroundColor = "white";
	 needleColor = "red";
	 backgroundColor = "black";
	 textFont = "Arial";
	 numberFont = "Arial";

canvas.add(new Circle(60,60,50).setFillColor(foregroundColor));
canvas.add(new Circle(60,60,40).setFillColor(backgroundColor));
canvas.add(new Circle(315,60,50).setFillColor(foregroundColor));
canvas.add(new Circle(315,60,40).setFillColor(backgroundColor));

canvas.add(new Rectangle(60,11,250,8)
.setColor(foregroundColor)
.setFillColor(foregroundColor));
canvas.add(new Rectangle(60,101,250,8)
.setColor(foregroundColor)
.setFillColor(foregroundColor));
canvas.add(new Rectangle(60,20,250,80)
.setColor(backgroundColor)
.setFillColor(backgroundColor));
canvas.add(new Line(60,10,250,0));
canvas.add(new Line(60,110,250,0));

canvas.add(new Text(40,80,"Start Again",60,textFont).setFillColor(foregroundColor));

canvas.repaint();