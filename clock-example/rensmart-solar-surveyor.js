function createSolarSurveyor() {
	canvas.add( new Picture(0,0,"rensmart-carbon.png") );

	canvas.add( new Circle(240,200,150).setFillColor("black") );
	canvas.add( new Circle(240,200,130).setFillColor("white") );

	canvas.add( new Circle(240,600,150).setFillColor("black") );
	canvas.add( new Circle(240,600,130).setFillColor("white") );

	//=========================

	shadow = 'rgba(0,0,0,0.5)';

	faceShadow = new Circle(241,201,130);
	faceShadow.color = shadow;
	face = new Circle(240,200,130);
	face.fillColor = "white";

	canvas.add( faceShadow );
	canvas.add( face );

	RADS=2*Math.PI;
	ticks=60;
	majorTicks=12;
	majorValue=12;
	outerValue = ["","","","","","","","","","","","","","","","",""];

	for(t=0;t<ticks;t++) {

	  i=(RADS*t)/ticks;

	  tick = new Composite(241,201,0);
	  line = new Line(0,-130,0,5);
	  line.color=shadow;
	  tick.add( line );
	  tick.rotation=i;
	  canvas.add( tick );

	  tick = new Composite(240,200,0);
	  line = new Line(0,-130,0,5);
	  tick.add( line);
	  tick.rotation=i;
	  canvas.add( tick );
	}

	for(t=1;t<=majorTicks;t++) {

	  i=(RADS*t)/majorTicks;

	  tick = new Composite(241,201,0);
	  line = new Line(0,-130,0,15);
	  line.color=shadow;
	  tick.add( line );
	  tick.rotation=i;
	  canvas.add( tick );

	  tick = new Composite(240,200,0);
	  line = new Line(0,-130,0,15);

	  value=Math.round((majorValue/majorTicks)*t)
	  text = new Text(-10,-100,""+value,10,"Arial");
	  text2 = new Text(-10,-130,outerValue[t],10,"Arial");
	  tick.add( line );
	  tick.add( text );
	  tick.add( text2 );
	  tick.rotation=i;
	  canvas.add( tick );
	}

	//=========================

	shadow = 'rgba(0,0,0,0.5)';

	faceShadow = new Circle(241,601,130);
	faceShadow.color = shadow;
	face = new Circle(240,600,130);
	face.fillColor = "white";

	canvas.add( faceShadow );
	canvas.add( face );

	RADS=2*Math.PI;
	ticks=32;
	majorTicks=16;
	majorValue=360;
	outerValue = ["N","","NW","","W","","SW","","S","","SE","","E","","NE","","N"];

	for(t=0;t<ticks;t++) {

	  i=(RADS*t)/ticks;

	  tick = new Composite(241,601,0);
	  line = new Line(0,-130,0,5);
	  line.color=shadow;
	  tick.add( line );
	  tick.rotation=i;
	  canvas.add( tick );

	  tick = new Composite(240,600,0);
	  line = new Line(0,-130,0,5);
	  tick.add( line);
	  tick.rotation=i;
	  canvas.add( tick );
	}

	for(t=1;t<=majorTicks;t++) {

	  i=(RADS*t)/majorTicks;

	  tick = new Composite(241,601,0);
	  line = new Line(0,-130,0,15);
	  line.color=shadow;
	  tick.add( line );
	  tick.rotation=i;
	  canvas.add( tick );

	  tick = new Composite(240,600,0);
	  line = new Line(0,-130,0,15);

	  value=Math.round((majorValue/majorTicks)*t)
	  text = new Text(-10,-100,""+value,10,"Arial");
	  text2 = new Text(-10,-134,outerValue[t],10,"Arial").setColor("yellow");
	  tick.add( line );
	  tick.add( text );
	  tick.add( text2 );
	  tick.rotation=i;
	  canvas.add( tick );
	}

	canvas.add( new Circle(190,240,30).setFillColor("blue") );
	canvas.add( new Circle(290,240,30).setFillColor("blue") );
	millis = new Arc(190,240,-90,55,30).setFillColor("yellow");
	canvas.add( millis );
	day = new Arc(290,240,-90,125,30).setFillColor("yellow");
	canvas.add( day );
	canvas.add( new Circle(190,240,10).setFillColor("black") );
	canvas.add( new Circle(290,240,10).setFillColor("black") );

	canvas.add( new Circle(240,600,80).setFillColor("blue") );
	canvas.add( new Arc(240,600,20,180,80).setFillColor("yellow") );
	canvas.add( new Circle(240,600,30).setFillColor("black") );
	canvas.add( new Text(225,610,"45",20,"Arial").setColor("yellow") );
	canvas.add( new Text(225,610,"45",20,"Arial").setFillColor("yellow") );

	hand = new Polygon(240,200);
	hand.addPoint(3,0);
	hand.addPoint(-3,0);
	hand.addPoint(-1,120);
	hand.addPoint(1,120);
	hand.setFillColor("yellow").setRotation(1.8);
	minuteHand = hand;
	canvas.add(hand);

	hand = new Polygon(240,200);
	hand.addPoint(4,0);
	hand.addPoint(-4,0);
	hand.addPoint(-2,90);
	hand.addPoint(2,90);
	hand.setFillColor("blue").setRotation(1.5);
	hourHand = hand;
	canvas.add(hand);

	hand = new Polygon(240,200);
	hand.addPoint(2,0);
	hand.addPoint(-2,0);
	hand.addPoint(0,110);
	hand.setFillColor("black").setRotation(0.5);
	secondHand = hand;
	canvas.add(hand);

	canvas.add( new Circle(240,200,20).setFillColor("blue") );
	canvas.add( new Circle(240,200,10).setFillColor("black") );

	//=========================
	canvas.repaint();
	
	face.animate = function(frame) {
		  updateTime();
		  millis.sweepAngle = now.getMilliseconds()*360/1000;
		  day.sweepAngle = now.getHours()*360/24;
	}
}

function updateTime() {
	  now = new Date();
	  hourHand.setRotation( convertToRadians(((now.getHours()%12)*60)+now.getMinutes(),720) );
	  minuteHand.setRotation( convertToRadians(now.getMinutes(),60) );
	  secondHand.setRotation( convertToRadians(now.getSeconds(),60) );
	  canvas.repaint();
}
function convertToRadians(value,maximum) {
	  value = value/maximum;
	  return (value * (2*Math.PI))-(Math.PI)
}