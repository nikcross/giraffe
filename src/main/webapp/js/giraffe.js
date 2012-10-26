/**
 * @overview
 * Griaffe HTML5 canvas graphics library
 * A set of Javascript objects that can be used to build animated
 * interactive graphics using the HTML5 canvas.
 * @author Nik Cross
 * @version 0.001 alpha
 * @license MIT
 */

/**
 * Canvas is the Giraffe representation of a canvas element on
 * a page.
 * @description
 * It can have any number of GraphicsObject added to it,
 * each drawn at its required place.
 * An instance of Canvas can also be used to control animation and interaction
 * between the user and GraphicsObjects using the Giraffe Animation library and
 * the Giraffe Interactive library
 * @class
 * @param {String} canvasElementId dom canvas id
 */
function Canvas(canvasElementId)
{
  self=this;
  this.id = "canvas"+Giraffe.canvases.length;
  
  Giraffe.canvases[ this.id ] = this;

  this.graphicsObjects = [];
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
  
  this.scaleX=1;
  this.scaleY=1;
  
  /**#@+
   * @memberOf Canvas
   */
  
  /**
   * Sets the scale of all graphics on the canvas. May be used to zoom in and out.
   * @param {float} scaleX the multiplier scale for the x axis. Must be greater than 0.
   * @param {float} scaleY the multiplier scale for the y axis. Must be greater than 0.
   */
  this.scale = function(scaleX,scaleY) {
      this.scaleX=scaleX;
      this.scaleY=scaleY;
  }
  
  this.scaleSet=false;
  
  /**
   * Clears the canvas and repaints all graphics on the canvas.
   * If not using the animation library, this method is called to
   * render the GraphicsObjects onto the canvas.
   */
  this.repaint = function()
  {
    this.canvasContext.clearRect(0,0,this.width,this.height); // clear canvas

    if(this.scaleSet==false) {
    	this.canvasContext.scale(this.scaleX,this.scaleY);
    	this.scaleSet=true;
    }
    for(this.loop=0;this.loop<this.graphicsObjects.length;this.loop++)
    {
    	if(this.graphicsObjects[this.loop].visible==true) {
    		this.graphicsObjects[this.loop]._repaint();
    	}
    }
  }

  /**
   * @private
   */
  this._store = function() {
    this.canvasContext.save();
  }

  /**
   * @private
   */
  this._restore = function() {
    this.canvasContext.restore();
  }

  /**
   * Adds a GraphicsObject instance to the canvas to be drawn
   * @param {GraphicsObject} graphicsObject an instance of a GraphicsObject to add to the canvas.
   *
   */
  this.add = function( graphicsObject )
  {
    this.graphicsObjects[this.graphicsObjects.length] = graphicsObject;
    graphicsObject.canvasParent = this;
    graphicsObject.canvas = this.canvasContext;
    graphicsObject.draw(); // initialises composites
  }
  
  /**
   * Removes a GraphicsObject instance from the canvas.
   * @param {GraphicsObject} graphicsObject to be removed
   */
  this.remove = function( graphicsObject ) {
	for(this.loop=0;this.loop<this.graphicsObjects.length;this.loop++)
    {
		if(this.graphicsObjects[this.loop]==graphicsObject) {
			graphicsObject.canvasParent=null;
			this.graphicsObjects.splice(this.loop,1);
		}
	}
  }
  
  /**
   * Stretches a canvas to fit a window while maintaining the design aspect ratio
   * @param screenDesignSize {Giraffe.Size} the width and height intended for the canvas
   */
  this.stretchToFitWindow = function() {
	 	var designWidth = screen.width;
	 	var designHeight = screen.height;
	 	
	 	var scaleChange = 1;
	   	var docWidth = window.outerWidth;
	   	var docHeight = window.outerHeight;

	   	if (docWidth != designWidth) {
	   		var scaleX = docWidth / designWidth;
	   		var scaleY = docHeight / designHeight;
	   		
	   		if (scaleX < scaleY) {
	   			scaleChange = scaleX;
	   		} else {
	   			scaleChange = scaleY;
	   		}
	   		
	   		this.scale(scaleChange,scaleChange);
	   	  	screen.width = designWidth*scaleChange;
	   	  	screen.height = designHeight*scaleChange;
	   	}
	   }
}
/**#@-*/

/**
 * This is the prototype object for all graphics objects that can be placed on a canvas.
 * Extend this prototype to create your own GraphicsObject.
 * @class
 * 
 * @param {number} x the position the graphics object is to be drawn at on the x axis 
 * @param {number} y the position the graphics object is to be drawn at on the y axis 
 */
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
  this.mouseOver=false;

  /**#@+
   * @memberOf GraphicsObject
   */
  /**
   * @private
   */
  this._repaint = function()
  {
    this.canvasParent._store();
    if(this.canvas==undefined) {
    	this.canvas = this.canvasParent.canvasContext;
    }
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

  /**
   * Uses the className to look up the values for color and background-color from
   * any css style sheet loaded in the current page.
   */
  this.setCSSClass = function(className) {
	  this.color = Giraffe.getCssValue(className,"color");
	  this.fillColor = Giraffe.getCssValue(className,"background-color");
	  return this;
  }
  
  /**
   * Sets the border outline color of the object.
   * @param {string} color a definition of the color. Can be in the form html color name eg. "blue", html hex color eg. '#00FF00' or red green blue alpha format eg. rgba(0,255,0,0.5)
   */
  this.setColor = function(color) {
    this.color=color;
    return this;
  }
  
  /**
   * Sets the fill color of the object.
   * @param {string} fillColor a definition of the color. Can be in the form html color name eg. "blue", html hex color eg. '#00FF00' or red green blue alpha format eg. rgba(0,255,0,0.5)
   */
  this.setFillColor = function(fillColor) {
    this.fillColor=fillColor;
    return this;
  }

  this.setRotation = function(rotation) {
	    this.rotation=rotation;
	    return this;
  }
  
  this.isInside = function(x,y){return false;}
  this.onClick = function(x,y){}
  this.onMouseOver = function(x,y){}
  this.onMouseOut = function(x,y){}
  this.onMousePressed = function(x,y){}
  this.onMouseReleased = function(x,y) {}
  this.animate = function(frame){}
  this.draw = function(){}
}
/**#@-*/

/**
 * Defines a graphics Circle primative
 * @class
 * @augments GraphicsObject
 * @param x {number} the position that the ... is to be drawn on the x axis
 * @param y {number} the position that the ... is to be drawn on the y axis
 * @param radius (number) the radius of the circle to be drawn. Must be greater than 0
 */
function Circle(x,y,radius)
{
	  /**#@+
	   * @memberOf Circle
	   */
  this.x=x;
  this.y=y;
  this.radius=radius;
  /**
   * @private
   */
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
  
  /**
   * Checks to see if a given point lies inside the circle.
   * @param posX {number} the x axis of the point to check
   * @param posY {number} the y axis of the point to check
   * @returns true if the point lies within the Circle
   */
  this.isInside = function(posX,posY) {
		//alert("testing "+posX+","+posY);
	var xl = this.x-posX;
	var yl = this.y-posY;
	if( Math.round( 
		Math.pow( (xl*xl)+(yl*yl),0.5)
	)<this.radius) {
		return true;
	} else {
		return false;
	}
  }
}
Circle.prototype = new GraphicsObject();
/**#@-*/

/**
 * Defines a graphics Rectangle primative
 * @class
 * @augments GraphicsObject
 * @param x {number} the position that the ... is to be drawn on the x axis
 * @param y {number} the position that the ... is to be drawn on the y axis
 * @param width (number) the width of the rectangle
 * @param height (number) the height of the rectangle
 */
function Rectangle(x,y,width,height)
{
	  /**#@+
	   * @memberOf Rectangle
	   */
  this.x=x;
  this.y=y;
  this.width=width;
  this.height=height;

  /**
   * Checks to see if a given point lies inside the rectangle.
   * @param posX {number} the x axis of the point to check
   * @param posY {number} the y axis of the point to check
   * @returns true if the point lies within the Rectangle
   */
  this.isInside = function(posX,posY) {
	if(
		posX-this.x>0 &&
		posX-this.x<this.width &&
		posY-this.y>0 &&
		posY-this.y<this.height
		){ return true; } else { return false; }
  }
  
  /**
   * @private
   */
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
/**#@-*/
/**
 * Defines a graphics Line primative from one point to another
 * @class
 * @augments GraphicsObject
 * @param x {number} the position that the Line is to be drawn on the x axis
 * @param y {number} the position that the Line is to be drawn on the y axis
 * @param x2 {number} the position that the Line is to be drawn to on the x axis
 * @param y2 {number} the position that the Line is to be drawn to on the y axis
 */
function Line(x,y,x2,y2)
{
	  /**#@+
	   * @memberOf Line
	   */
  this.x=x;
  this.y=y;
  this.x2=x2;
  this.y2=y2;

  /**
   * @private
   */
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
/**#@-*/
/**
 * Defines a graphics primative
 * @class
 * @augments GraphicsObject
 * @param x {number} the position that the ... is to be drawn on the x axis
 * @param y {number} the position that the ... is to be drawn on the y axis
 */
function Text(x,y,text,textSize,font)
{
	  /**#@+
	   * @memberOf Text
	   */
  this.x=x;
  this.y=y;
  this.text=text;
  this.textSize=textSize;
  this.font = font;

  /**
   * @private
   */
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
  
  /**
   * Checks to see if a given point lies inside the bounds of the text.
   * @param posX {number} the x axis of the point to check
   * @param posY {number} the y axis of the point to check
   * @returns true if the point lies within the Text
   */
  this.isInside = function(posX,posY) {
	if(
		posX-this.x>(this.textSize/2) &&
		posX-this.x<this.textSize+(this.text.length*(this.textSize/2)) &&
		posY-this.y>-(this.textSize/2) &&
		posY-this.y<(this.textSize/2)
		){ return true; } else { return false; }
  }
}
Text.prototype = new GraphicsObject();
/**#@-*/
/**
 * Defines a graphics Picture primative
 * @class
 * @augments GraphicsObject
 * @param x {number} the position that the picture is to be drawn on the x axis
 * @param y {number} the position that the picture is to be drawn on the y axis
 * @param src {string} the uri of the image to  be used. The image can be in gif, png or jpeg format.
 */
function Picture(x,y,src)
{
	  /**#@+
	   * @memberOf Picture
	   */
  this.x=x;
  this.y=y;
  this.img = new Image();
  this.img.src = src;
/**
 * @private
 */
  this.draw = function()
  {
    this.canvas.strokeStyle = this.color;
    this.canvas.drawImage(this.img,0,0);
  }
  
  /**
   * Checks to see if a given point lies inside the bounds of the picture.
   * @param posX {number} the x axis of the point to check
   * @param posY {number} the y axis of the point to check
   * @returns true if the point lies within the picture
   */
  this.isInside = function(posX,posY) {
	if(
		posX-this.x>0 &&
		posX-this.x<this.img.width &&
		posY-this.y>0 &&
		posY-this.y<this.img.height
		){ return true; } else { return false; }
  }
}
Picture.prototype = new GraphicsObject();
/**#@-*/
/**
 * Defines a graphics primative
 * @class
 * @augments GraphicsObject
 * @param x {number} the position that the ... is to be drawn on the x axis
 * @param y {number} the position that the ... is to be drawn on the y axis
 */
function Polygon(x,y)
{
	  /**#@+
	   * @memberOf Polygon
	   */
  this.x=x;
  this.y=y;

  this.points = new Array();
  this.addPoint = function(px,py) {
    this.points[this.points.length]=[px,py];
    return this;
  }
  /**
   * @private
   */
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
/**#@-*/
/**
 * Defines a graphics primative
 * @class
 * @augments GraphicsObject
 * @param x {number} the position that the ... is to be drawn on the x axis
 * @param y {number} the position that the ... is to be drawn on the y axis
 */
function Arc(x,y,startAngle,sweepAngle,radius)
{
	  /**#@+
	   * @memberOf Arc
	   */
  this.x=x;
  this.y=y;
  this.startAngle=startAngle;
  this.sweepAngle=sweepAngle;
  this.radius=radius;
  /**
   * @private
   */
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
  
  this.isInside = function(posX,posY) {
	var xl = this.x-posX;
	var yl = this.y-posY;
	var d = Math.pow( (xl*xl)+(yl*yl),0.5);
	if( d<this.radius ) {
		if(xl==0 && yl==0) return true;
		var a = Math.atan(yl/xl);
		if(xl>0) a=Math.PI+a;
		if(a<0) a=(Math.PI*2)+a;
		a = (a*180)/(Math.PI)
		if(a>=this.startAngle &&
		a<=this.startAngle+this.sweepAngle) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
  }
}
Arc.prototype = new GraphicsObject();
/**#@-*/
/**
 * Defines a graphics primative
 * @class
 * @augments GraphicsObject
 * @param x {number} the position that the ... is to be drawn on the x axis
 * @param y {number} the position that the ... is to be drawn on the y axis
 */
function Composite(x,y,rotation)
{
	  /**#@+
	   * @memberOf Composite
	   */
  this.x=x;
  this.y=y;
  this.rotation=rotation;
  this.parts = [];

  this.add = function( part )
  {
    if(part.canvasParent!=null)
    {
      return;
    }
    part.canvasParent = this.canvasParent;
    this.parts[this.parts.length] = part;
  }

  this.remove = function( part ) {
	for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {
		if(this.parts[this.loop]==part) {
			part.canvasParent=null;
			this.parts.splice(this.loop,1);
		}
	}
  }
  
  this.deconstruct = function() {
	for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {
		var part = this.parts[this.loop];
		part.x += this.x;
		part.y += this.y;
		part.onMouseOver = this.onMouseOver;
		part.onMouseOut = this.onMouseOut;
		part.onMousePressed = this.onMousePressed;
		part.onMouseReleased = this.onMouseReleased;
		part.onClick = this.onClick;
		part.rotation += this.rotation;
		part.canvasParent=null;
		this.canvasParent.add( part );
	}
	this.parts = new Array();
  }
  /**
   * @private
   */  
  this.draw = function()
  {
    for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {
      if(this.parts[this.loop].canvasParent==null)
      {
        this.parts[this.loop].canvasParent=this.canvasParent;
        this.parts[this.loop].canvas=this.canvas;
      }
      if(this.parts[this.loop].visible==true) {
    	  this.parts[this.loop]._repaint();
      }
    }    
  }

  this.animate = function(frame) {
    for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {    
      this.parts[this.loop].animate(frame);
    }
  }
  
  this.isInside = function(posX,posY) {
    for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {    
      if(this.parts[this.loop].visible===true && this.parts[this.loop].isInside(posX-this.x,posY-this.y)) {
		return true;
	  }
    }
	return false;
  }
  
  this.onClick = function(posX,posY) {
    for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {    
		if(this.parts[this.loop].visible===true && this.parts[this.loop].isInside(posX-this.x,posY-this.y)) {
			this.parts[this.loop].onClick(posX-this.x,posY-this.y);
		}
    }
	return false;
  }  
  this.onMouseOver = function(posX,posY) {
    for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {
		if(this.parts[this.loop].visible===true && this.parts[this.loop].isInside(posX-this.x,posY-this.y)) {    
			this.parts[this.loop].onMouseOver(posX-this.x,posY-this.y);
			this.parts[this.loop].mouseOver=true;
		} else if(this.parts[this.loop].mouseOver==true) {
			this.parts[this.loop].mouseOver=false;
			this.parts[this.loop].onMouseOut(posX-this.x,posY-this.y);
		}
    }
  } 
  this.onMouseOut = function(posX,posY) {
    for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {
		if(this.parts[this.loop].mouseOver==true) {
			this.parts[this.loop].mouseOver=false;
			this.parts[this.loop].onMouseOut(posX-this.x,posY-this.y);
		}
    }
  }   
  this.onMousePressed = function(posX,posY) {
    for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {    
		if(this.parts[this.loop].visible===true && this.parts[this.loop].isInside(posX-this.x,posY-this.y)) {  
			this.parts[this.loop].onMousePressed(posX-this.x,posY-this.y);
		}
    }
  } 
  this.onMouseReleased = function(posX,posY) {
    for(this.loop=0;this.loop<this.parts.length;this.loop++)
    {    
      this.parts[this.loop].onMouseReleased(posX-this.x,posY-this.y);
    }
  } 
}
Composite.prototype = new GraphicsObject();
/**#@-*/
/**
 * Defines a graphics primative
 * @description
 * <iframe src="/web/giraffe/examples/giraffe-examples-home-page.html" width="500" height="500"></iframe>
 * @class
 * @augments GraphicsObject
 * @param x {number} the position that the ... is to be drawn on the x axis
 * @param y {number} the position that the ... is to be drawn on the y axis
 */
function RadialColor(canvas,color1,color2,x,y,radius) {
	  /**#@+
	   * @memberOf RadialColor
	   */
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
/**#@-*/
/**
 * Some helper methods used by Giraffe
 * @class
 */
Giraffe = {
		/**
		 * @private
		 */
		canvases : [],
		/**
		 * @private
		 */
		getCssValue : function(selector,attribute) {
			selector = selector.toLowerCase();
		   for(sheet=0;sheet<document.styleSheets.length;sheet++) {
			   var stylesheet = document.styleSheets[sheet];
			   var n = stylesheet.cssRules.length;
			   for(var i=0; i<n; i++)
			   {
			      var selectors = stylesheet.cssRules[i].selectorText.toLowerCase().split(",");
			      var m = selectors.length;
			      for(j=0; j<m; j++)
			      {
			         if(selectors[j].trim() == selector)
			         {
			            var value = stylesheet.cssRules[i].style.getPropertyValue(attribute);
			            if(value!="")
			            {
			               return value;
			            }
			         }
			      }
			   }
		   }
		   return null;
		},
		/**
		 * A color that can be used to create a shadow
		 */
		Shadow : "rgba(0,0,0,0.5)"
}

/**
 * @private
 */
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