example = { run: function() {
//START
Giraffe.PolyMorphSequence = function(target,data,frames,steps) {
	this.frames = frames;
	this.target = target;
  	this.data = data;
	this.steps = steps;
	this.canvas = target.canvasParent;
	this.register();
	this.currentFrame=0;
    this.animationSteps = 25
    self = this;

	this.processFrame = function(frame) {
      for(index=0;index<this.data.length;index++) {
        this.target.points[index][0] = this.data[index].x;
        this.target.points[index][1] = this.data[index].y;
      }
      
		return true;
	}
}
Giraffe.PolyMorphSequence.prototype = new Giraffe.Transition();


function Chart(width,height,data,xTitle,yTitle,xTicks,yTicks) {
  leftMargin = 50;
  rightMargin = 50;
  bottomMargin = 50;
  topMargin = 50;
  
  innerWidth = width-leftMargin-rightMargin;
  innerHeight = height-topMargin-bottomMargin;
  
  minimumValue = function() {
    var min=data[0];
    for(index in data) {
      if(data[index]<min) min=data[index];
    }
    return min;
  }
    
  maximumValue = function() {
    var max=data[0];
    for(index in data) {
      if(data[index]>max) max=data[index];
    }
    return max;
  }
  
  plotPoints = [data.length];
    
  plot = function(x,y) {
    plotPoints[x] = [
      (x*xTickWidth)+leftMargin,
      (topMargin+innerHeight)-((y-yOffset)*yScale)
    ];
  }    
    
  render = function() {
    points = [];
    poly = new Polygon(0,0).setFillColor(canvas.Shadow).setColor("green");

    for(index in plotPoints) {
    	point = plotPoints[index];
        poly.addPoint(point[0],(topMargin+innerHeight));
    }
    
    canvas.add(poly);
    poly.addPoint(leftMargin+innerWidth,topMargin+innerHeight);
    poly.addPoint(leftMargin,topMargin+innerHeight);
    
    for(index in plotPoints) {
    	point = plotPoints[index];
    	canvas.add(new Text(point[0],point[1]-8,""+index+","+data[index],10));
	
        marker = new Circle(point[0],(topMargin+innerHeight),5).setColor("red").setFillColor("blue");
        points[index]=marker;
        canvas.add(marker);
        sequence = new Giraffe.MoveSequence(marker,self.animationSteps,[0,-((topMargin+innerHeight)-point[1])/self.animationSteps]);
        sequence.start();
    }
    
    new Giraffe.PolyMorphSequence(poly,points,self.animationSteps,1).start();
  }
  
  xTickWidth = innerWidth/(data.length-1);
  yOffset = minimumValue();
  yScale = innerHeight / (maximumValue()-yOffset);
  
  //canvas.add(new Text(20,20,""+minimumValue(),12));
  //canvas.add(new Text(20,40,""+maximumValue(),12));
  //canvas.add(new Text(20,60,""+yScale,12));
  
  for(index=0;index<data.length;index++) {
    plot(index,data[index]);
  }
  
  this.init = function () {
  render();
  if(xTitle) {
    canvas.add(new Text(leftMargin/2,topMargin+(innerHeight/2),xTitle,20).setRotation(-Math.PI/2));
  }
  if(yTitle) {
    canvas.add(new Text(leftMargin+(innerWidth/2),topMargin/2,yTitle,20));
  }
  
  if(xTicks) {
    xTickSize = innerWidth/(xTicks.length-1);
    for(index in xTicks) {
      canvas.add( new Text(leftMargin+(xTickSize*index),topMargin+innerHeight+12,xTicks[index],12) );
    }
  }
  
  if(yTicks) {
    yTickSize = innerHeight/(yTicks.length-1);
    for(index in yTicks) {
      canvas.add( new Text(leftMargin-20,topMargin+innerHeight-(yTickSize*index),xTicks[index],12) );
    }
  }
  
  canvas.add(new Line(leftMargin,topMargin+innerHeight,innerWidth,0));
  canvas.add(new Line(leftMargin,topMargin+innerHeight,0,-innerHeight));
  }
}

var data = [100,20,50,40,30,50,90,120,150];

chart = new Chart(500,400,data,"X Axis","Y Axis",["a","b","c"],["1","2","3","4"]);
chart.init();
//END
}}

exampleLoaded();