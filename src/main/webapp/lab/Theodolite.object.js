function Theodolite(x,y) {
	this.x=x;
	this.y=y;
	this.add(new Rectangle(0,-480,35,1440).setFillColor("white"));
	this.add(new Circle(35,240,70).setFillColor("white"));
	
	xAngle = new Composite(0,0,0);
	for(i=0;i<180;i+=5) {
	  xAngle.add(new Line(0,i*4,10,0));
	  xAngle.add(new Text(12,(i*4)+4,""+(i-90),8));
	}
	this.add(xAngle);
	
	compass = new Composite(400,480,0);
	compass.add(new Circle(0,0,100).setFillColor("white"));
	label = ["N","NNE","NE","ENE","E","ESE","SE","SSE",
	"S","SSW","SW","WSW","W","WNW","NW","NNW"];
	for(i=0;i<64;i++) {
	  dx = Math.sin( 2*Math.PI*i/64 );
	  dy = Math.cos( 2*Math.PI*i/64 );
	  if(i%4==0) {
	    compass.add(new Line(dx*90,dy*90,dx*10,dy*10));
	
	    dv = label[i/4].length*0.4;
	
	    dx = Math.sin( 2*Math.PI*(i+dv)/64 );
	    dy = Math.cos( 2*Math.PI*(i+dv)/64 );
	    compass.add(new Text((dx*80),(dy*80),label[i/4],8).setRotation(Math.PI-(2*Math.PI*i/64)));
	  } else {
	    compass.add(new Line(dx*95,dy*95,dx*5,dy*5));
	  }
	}
	this.add(compass);
	
	yAngle = new Composite(800,240,0);
	yAngle.add(new Circle(0,0,100).setFillColor("white"));
	for(i=0;i<64;i++) {
	  dx = Math.sin( 2*Math.PI*i/64 );
	  dy = Math.cos( 2*Math.PI*i/64 );
	  if(i%4==0) {
	    yAngle.add(new Line(dx*90,dy*90,dx*10,dy*10));
	
	    label = ""+(i*5.625);
	    dv = label.length*0.4;
	
	    dx = Math.sin( 2*Math.PI*(i+dv)/64 );
	    dy = Math.cos( 2*Math.PI*(i+dv)/64 );
	    yAngle.add(new Text((dx*80),(dy*80),label,8).setRotation(Math.PI-(2*Math.PI*i/64)));
	  } else {
	    yAngle.add(new Line(dx*95,dy*95,dx*5,dy*5));
	  }
	}
	this.add(yAngle);
	
	this.add(new Line(0,240,35,0).setColor("red"));
	this.add(new Line(400,380,0,40).setColor("red"));
	this.add(new Line(700,240,35,0).setColor("red"));
	this.add(new Rectangle(380,220,40,40).setColor("red"));
	
	compassText = new Text(375,460,"000",20).setColor("red");
	this.add(compassText);
	yAngleText = new Text(745,250,"000",20).setColor("red");
	this.add(yAngleText);
	xAngleText = new Text(45,250,"000",20).setColor("red");
	this.add(xAngleText);
	
	compassRotation=45;
	xAngleRotation=45;
	yAngleRotation=45;
	
	compass.setRotation( Math.PI+((compassRotation*2*Math.PI)/360) );
	yAngle.setRotation( Math.PI/2+((yAngleRotation*2*Math.PI)/360) );
	xAngle.y = -(xAngleRotation*4)-120;
}
Theodolite.prototype = new Composite();