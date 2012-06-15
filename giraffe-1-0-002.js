var canvases = new Array();

function Canvas(canvasElementId)
{
  this.id = "canvas"+canvases.length;
  canvases[ this.id ] = this;

  this.graphicsObjects = new Array();
  this.canvasElement = document.getElementById(canvasElementId);

  if(BrowserDetect.browser=="MSIE" || BrowserDetect.browser=="Explorer") 
  {
     this.canvasElement = window.G_vmlCanvasManager.initElement(this.canvasElement); 
  }

  this.width = this.canvasElement.width;
  this.height = this.canvasElement.height;
  this.canvasContext = this.canvasElement.getContext('2d');
  CanvasTextFunctions.enable(this.canvasContext);

  this.canvasContext.clearRect(0,0,this.width,this.height); // clear canvas

  this.repaint = function()
  {
    this.canvasContext.clearRect(0,0,this.width,this.height); // clear canvas
    for(this.loop=0;this.loop<this.graphicsObjects.length;this.loop++)
    {
    	if(this.graphicsObjects[this.loop].visible==true) {
    		this.graphicsObjects[this.loop]._repaint();
    	}
    }
  }

  this._store = function()
  {
    this.canvasContext.save();
  }

  this._restore = function()
  {
    this.canvasContext.restore();
  }

  this.add = function( graphicsObject )
  {
    this.graphicsObjects[this.graphicsObjects.length] = graphicsObject;
    graphicsObject.canvasParent = this;
    graphicsObject.canvas = this.canvasContext;
  }
  
  this.frame = 0;
  this.interval = null;
  this.frames = 0;
  this.looped = true;

  this.startAnimation = function(fps,frames,looped)
  {
    this.frame = 0;
    this.frames = frames;
    this.looped = looped;
    this.interval = setInterval("canvases[\""+this.id+"\"].animate();",1000/fps);
  }

  this.stopAnimation = function()
  {
    clearInterval( this.interval );
  }

  this.animate = function()
  {
    for(this.loop=0;this.loop<this.graphicsObjects.length;this.loop++)
    {
      this.graphicsObjects[this.loop].animate(this.frame);
    }
    this.repaint();
    this.frame++;
    if(this.frame>=this.frames)
    {
      if(this.looped==true)
      {
        this.frame=0;
      }
      else
      {
        this.stopAnimation();
      }
    }
  }
}

function GraphicsObject(x,y)
{
  this.canvasParent = null;
  this.canvas = null;
  this.x = x;
  this.y = y;
  this.rotation = 0;
  this.color = "black";
  this.fillColor = null;
  this.scaleX = 1;
  this.scaleY = 1;
  this.visible=true;

  this._repaint = function()
  {
    this.canvasParent._store();
    this.canvas.translate(this.x,this.y);
    if(this.scaleX!=1 || this.scaleY!=1)
    {
      this.canvas.scale(this.scaleX,this.scaleY);
    }
    if(this.rotation!=0)
    {
      this.canvas.rotate(this.rotation);
    }
    this.draw();
    this.canvasParent._restore();
  }

  this.setColor = function(color) {
    this.color=color;
    return this;
  }
  this.setFillColor = function(fillColor) {
    this.fillColor=fillColor;
    return this;
  }

  this.setRotation = function(rotation) {
	    this.rotation=rotation;
	    return this;
  }
  
  this.animate = function(frame){}
  this.draw = function(){}
}

function Circle(x,y,radius)
{
  this.x=x;
  this.y=y;
  this.radius=radius;
  this.draw = function()
  {
    this.canvas.beginPath();
    if(this.fillColor!=null)
    {
      this.canvas.fillStyle = this.fillColor;
    }
    this.canvas.strokeStyle = this.color;
    this.canvas.arc(0,0,this.radius,0,6.2,false);
    this.canvas.closePath()
    if(this.fillColor!=null)
    {
      this.canvas.fill();
    }
    this.canvas.stroke(); 
  }
}
Circle.prototype = new GraphicsObject();


function Rectangle(x,y,width,height)
{
  this.x=x;
  this.y=y;
  this.width=width;
  this.height=height;

  this.draw = function()
  {
    if(this.fillColor!=null)
    {
      this.canvas.fillStyle = this.fillColor;
    }
    this.canvas.strokeStyle = this.color;
    this.canvas.strokeRect(0,0,this.width,this.height);
    if(this.fillColor!=null)
    {
      this.canvas.fillRect(0,0,this.width,this.height);
    }
    this.canvas.stroke(); 
  }
}
Rectangle.prototype = new GraphicsObject();

function Line(x,y,x2,y2)
{
  this.x=x;
  this.y=y;
  this.x2=x2;
  this.y2=y2;

  this.draw = function()
  {
    this.canvas.strokeStyle = this.color;

    this.canvas.beginPath();
    this.canvas.moveTo(0,0); 
    this.canvas.lineTo(this.x2,this.y2); 
    this.canvas.closePath();

    this.canvas.stroke(); 
  }
}
Line.prototype = new GraphicsObject();

function Text(x,y,text,textSize,font)
{
  this.x=x;
  this.y=y;
  this.text=text;
  this.textSize=textSize;
  this.font = font;

  this.draw = function()
  {
    if(this.fillColor!=null)
    {
      this.canvas.fillStyle = this.fillColor;
    }
    this.canvas.strokeStyle = this.color;

    if(this.font=="line") {
      this.canvas.drawText("sans",this.textSize,0,0,this.text);
    } else {
      this.canvas.font = this.textSize+"px "+this.font;
      if(this.fillColor!=null)
      {
        this.canvas.fillText(this.text,0,0,400);
      } else {
        this.canvas.strokeText(this.text,0,0,400);
      }
    }
  }
}
Text.prototype = new GraphicsObject();

function Picture(x,y,src)
{
  this.x=x;
  this.y=y;
  this.img = new Image();
  this.img.src = src;

  this.draw = function()
  {
    this.canvas.strokeStyle = this.color;
    this.canvas.drawImage(this.img,0,0);
  }
}
Picture.prototype = new GraphicsObject();

function Polygon(x,y)
{
  this.x=x;
  this.y=y;

  this.points = new Array();
  this.addPoint = function(px,py) {
    this.points[this.points.length]=[px,py];
    return this;
  }

  this.draw = function()
  {
    this.canvas.beginPath();
    if(this.fillColor!=null)
    {
      this.canvas.fillStyle = this.fillColor;
    }
    this.canvas.strokeStyle = this.color;
    this.canvas.moveTo(this.points[0][0],this.points[0][1]);
    for(i=1;i<this.points.length;i++) {
      this.canvas.lineTo(this.points[i][0],this.points[i][1]);
    }
    this.canvas.lineTo(this.points[0][0],this.points[0][1]);
    if(this.fillColor!=null)
    {
      this.canvas.fill();
    }
    this.canvas.stroke(); 
  }
}
Polygon.prototype = new GraphicsObject();

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

function Composite(x,y,rotation)
{
  this.x=x;
  this.y=y;
  this.rotation=rotation;
  this.parts = new Array();

  this.add = function( part )
  {
    if(part.canvasParent!=null)
    {
      return;
    }
    this.parts[this.parts.length] = part;
  }

  this.draw = function()
  {
    for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {
      if(this.parts[this.loop].canvasParent==null)
      {
        this.parts[this.loop].canvasParent=this.canvasParent;
        this.parts[this.loop].canvas=this.canvas;
      }
      this.parts[this.loop]._repaint();
    }    
  }

  this.animate = function(frame) {
    for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {    
      this.parts[this.loop].animate();
    }
  }
}
Composite.prototype = new GraphicsObject();

function RadialColor(canvas,color1,color2,x,y,radius) {
  this.canvas = canvas.canvasContext;
  this.colorStop = new Array();
  this.colorStop[0] = [0,color1,0,0,radius];
  this.colorStop[1] = [1,color2,x,y,0];

  this.getColor = function() {
    gradient = this.canvas.createRadialGradient(
      this.colorStop[1][2],this.colorStop[1][3],this.colorStop[1][4],
      this.colorStop[0][2],this.colorStop[0][3],this.colorStop[0][4]
    );
    var i=0;
    for(i=0;i<this.colorStop.length;i++)
    {
      gradient.addColorStop(this.colorStop[i][0],this.colorStop[i][1]);
    }
    return gradient;
  }
}

shadow = "rgba(0,0,0,0.5)";

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();