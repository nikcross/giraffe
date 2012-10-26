function Clock(x,y,faceImgUrl) {
	this.x = x;
	this.y = y;
	
	clockFace = new Picture(0,0,faceImgUrl);
	this.add( clockFace );
	
	shadow='rgba(0,0,0,0.5)';
	
	secondHand = new Polygon(0,0);
	secondHand .addPoint(2,0);
	secondHand .addPoint(0,-130);
	secondHand .addPoint(-2,0);
	secondHand .fillColor="red";
	
	minuteHand = new Polygon(0,0);
	minuteHand .addPoint(2,0);
	minuteHand .addPoint(2,-130);
	minuteHand .addPoint(-2,-130);
	minuteHand .addPoint(-2,0);
	minuteHand .fillColor="white";
	
	hourHand = new Polygon(0,0);
	hourHand .addPoint(4,0);
	hourHand .addPoint(4,-70);
	hourHand .addPoint(-4,-70);
	hourHand .addPoint(-4,0);
	hourHand .fillColor="white";
	
	secondHandShadow = new Polygon(2,2);
	secondHandShadow .addPoint(2,0);
	secondHandShadow .addPoint(0,-130);
	secondHandShadow .addPoint(-2,0);
	secondHandShadow .fillColor=shadow;
	secondHandShadow .color=shadow;
	
	minuteHandShadow = new Polygon(2,2);
	minuteHandShadow .addPoint(4,0);
	minuteHandShadow .addPoint(4,-130);
	minuteHandShadow .addPoint(-4,-130);
	minuteHandShadow .addPoint(-4,0);
	minuteHandShadow .fillColor=shadow;
	minuteHandShadow .color=shadow;
	
	hourHandShadow = new Polygon(2,2);
	hourHandShadow .addPoint(4,0);
	hourHandShadow .addPoint(4,-70);
	hourHandShadow .addPoint(-4,-70);
	hourHandShadow .addPoint(-4,0);
	hourHandShadow .fillColor=shadow;
	hourHandShadow .color=shadow;
	
	hub = new Circle(200,200,8);
	hub.fillColor="white";
	hubShadow = new Circle(202,202,8);
	hubShadow.fillColor=shadow;
	hubShadow.color=shadow;
	
	RADS=2*Math.PI;
	
	secondHand.animate = function(frame) {
	  this.rotation = (RADS*new Date().getSeconds())/60;
	}
	minuteHand.animate = function(frame) {
	  this.rotation = (RADS*new Date().getMinutes())/60;
	}
	hourHand.animate = function(frame) {
	  this.rotation = (RADS*((new Date().getHours()*60)+new Date().getMinutes()))/720;
	}
	secondHandShadow.animate = secondHand.animate;
	minuteHandShadow.animate = minuteHand.animate;
	hourHandShadow.animate = hourHand.animate;
	
	hands = new Composite(200,200,0);
	hands.add(secondHandShadow);
	hands.add(secondHand);
	hands.add(minuteHandShadow);
	hands.add(minuteHand);
	hands.add(hourHandShadow);
	hands.add(hourHand);
	this.add(hands);
	this.add(hubShadow);
	this.add(hub);
}
Clock.prototype = new Composite();