function Compass(x,y,faceImgUrl) {
	this.x = x;
	this.y = y;	
	
	compassFace = new Picture(0,0,faceImgUrl);
	this.add( compassFace );
	
	north = new Polygon(0,0);
	north.addPoint(6,0);
	north.addPoint(-6,0);
	north.addPoint(0,-130);
	north.fillColor="red";
	
	northShadow = new Polygon(0,0);
	northShadow.addPoint(6,0);
	northShadow.addPoint(-6,0);
	northShadow.addPoint(0,-130);
	northShadow.fillColor="grey";
	northShadow.color="grey";
	
	south = new Polygon(0,0);
	south.addPoint(6,0);
	south.addPoint(-6,0);
	south.addPoint(0,130);
	south.fillColor="white";
	
	southShadow = new Polygon(0,0);
	southShadow.addPoint(6,0);
	southShadow.addPoint(-6,0);
	southShadow.addPoint(0,130);
	southShadow.fillColor="gray";
	southShadow.color="gray";
	
	hub = new Circle(0,0,8);
	hub.fillColor="white";
	
	needle = new Composite(200,200,0);
	needleShadow = new Composite(203,203,0);
	
	needleShadow.add(northShadow);
	needleShadow.add(southShadow);
	needle.add(north);
	needle.add(south);
	needle.add(hub);
	
	needle.animate = function(frame) {
	  needle.rotation = needle.rotation+((Math.random()-0.5)/4);
	  needleShadow.rotation = needle.rotation;
	}
	
	this.add(needleShadow);
	this.add(needle);
}
Compass.prototype = new Composite();