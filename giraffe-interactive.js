/**
 * @class
 */
Giraffe.Interactive = {
		shiftKeyDown : false,
		controlKeyDown : false,
		init : function() {
			document.onkeydown = Giraffe.Interactive.keyDownHandler;
			document.onkeyup = Giraffe.Interactive.keyUpHandler;
			shiftKeyDown = false;
			controlKeyDown = false;
		},
		keyDownHandler : function(e) {
		    var pressedKey;
		    if (document.all) { e = window.event;
		        pressedKey = e.keyCode; }
		    if (e.which) {
		        pressedKey = e.which;
		    }
			if(pressedKey==16) {
				Giraffe.Interactive.shiftKeyDown=true;
			} else if(pressedKey=17) {
				Giraffe.Interactive.controlKeyDown=true;
			}
		},
		keyUpHandler : function(e) {
		    var pressedKey;
		    if (document.all) { e = window.event;
		        pressedKey = e.keyCode; }
		    if (e.which) {
		        pressedKey = e.which;
		    }
			if(pressedKey==16) {
				Giraffe.Interactive.shiftKeyDown=false;
			} else if(pressedKey=17) {
				Giraffe.Interactive.controlKeyDown=false;
			}
		},
		setInteractive : function(canvas) {
  
		  canvas.convertEvent = function(event,element) { 
			  position = getPosition(element);
			  x=event.x-position[Giraffe.X];
			  y=event.y-position[Giraffe.Y];
			  return {
				x : x, y : y  
			  }
		  }
  
		  canvas.onClick = function(event) {
		    event = self.convertEvent(event,self.canvasElement);
				
			for(this.loop=0;this.loop<self.graphicsObjects.length;this.loop++)
		    {
			  if(self.graphicsObjects[this.loop].visible===true && self.graphicsObjects[this.loop].isInside(event.x,event.y)) {
				self.graphicsObjects[this.loop].onClick(event.x,event.y);
			  }
			 }
		  }
		 canvas.onMouseDown = function(event) {
		event = self.convertEvent(event,self.canvasElement);
			
	    if(self.dragAndDrop==true) {
			self.dragStart=[event.x,event.y];
			self.dragging=new Array();
		}
		for(var dragTarget in self.draggable) {
			dragTarget=self.draggable[dragTarget];
	
			if(dragTarget.isInside(event.x,event.y)) {
				var included = false;
				for(var check in self.dragging) {
					check = self.dragging[check];
					if(check==dragTarget) {
						included=true;
						break;
					}
				}
				if(included==true) {
					continue;
				}
				dragTarget.dragging=true;
				self.dragging[self.dragging.length]=dragTarget;
				dragTarget.dragStart=[dragTarget.x,dragTarget.y];
				if(Giraffe.Interactive.shiftKeyDown==false) break;
			}
		}
		
		for(this.loop=0;this.loop<self.graphicsObjects.length;this.loop++)
	    {
		  if(self.graphicsObjects[this.loop].isInside(event.x,event.y)) {
			self.graphicsObjects[this.loop].onMousePressed(event.x,event.y);
		  }
		 }
	  }
	  canvas.onMouseUp = function(event) {
		event = self.convertEvent(event,self.canvasElement);
			
		if(self.dragAndDrop==true && self.dragging.length>0) {
			for(this.loop=0;this.loop<self.graphicsObjects.length;this.loop++)
			{
				if(self.graphicsObjects[this.loop].dragging) {
					self.graphicsObjects[this.loop].dragging=false;
				}
				if(self.graphicsObjects[this.loop].isInside(event.x,event.y)) {
					if(self.graphicsObjects[this.loop].onCatch) {
						for(var dropped in self.dragging) {
							dropped = self.dragging[dropped];
							if(self.graphicsObjects[this.loop]==dropped) {
								continue;
							}
							self.graphicsObjects[this.loop].onCatch(dropped,event.x,event.y);
						}
					}
				}
			}
	  		self.dragging=new Array();
		}
		for(this.loop=0;this.loop<self.graphicsObjects.length;this.loop++)
	    {
			self.graphicsObjects[this.loop].onMouseReleased(event.x,event.y);
		}
	  }
	  canvas.onMouseMoved = function(event) {
		event = self.convertEvent(event,self.canvasElement);
		
	    if(self.dragAndDrop==true) {
			var dragDX = event.x-self.dragStart[0];
			var dragDY = event.y-self.dragStart[1];
			for(var dragTarget in self.dragging) {
				dragTarget = self.dragging[dragTarget];
				dragTarget.x = dragTarget.dragStart[0]+dragDX;
				dragTarget.y = dragTarget.dragStart[1]+dragDY;
			}
		}
		for(this.loop=0;this.loop<self.graphicsObjects.length;this.loop++)
	    {
		  if(self.graphicsObjects[this.loop].isInside(event.x,event.y)) {
			self.graphicsObjects[this.loop].mouseOver=true;
			self.graphicsObjects[this.loop].onMouseOver(event.x,event.y);
		  } else if(self.graphicsObjects[this.loop].mouseOver==true) {
			self.graphicsObjects[this.loop].mouseOver=false;
			self.graphicsObjects[this.loop].onMouseOut(event.x,event.y);
		  }
		}
	  }
	  
	  canvas.makeDraggable = function(object) {
		this.dragAndDrop = true;
		this.draggable[this.draggable.length]=object;
	  }
	  
	  canvas.dragStart = [0,0];
	  canvas.dragging = new Array();
	  canvas.draggable = new Array();
	  canvas.dragAndDrop = false; 
	  
		canvas.canvasElement.onmousemove = canvas.onMouseMoved;
		canvas.canvasElement.onmouseup = canvas.onMouseUp;
		canvas.canvasElement.onmousedown = canvas.onMouseDown;
		canvas.canvasElement.onclick = canvas.onClick;
	}
}
Giraffe.Interactive.init();

/* behaviours */
function setReveal(target,reveal) {
	target.onMouseOver = function(x,y) {
		reveal.visible=true;
	}
	target.onMouseOut = function(x,y) {
		reveal.visible=false;
	}
	reveal.visible=false;
}

function getPosition(obj) {
	this.curleft = this.curtop = 0;
	if (obj.offsetParent) {
		this.curleft = obj.offsetLeft
		this.curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			this.curleft += obj.offsetLeft
			this.curtop += obj.offsetTop
		}
	}
	return [this.curleft,this.curtop];
}