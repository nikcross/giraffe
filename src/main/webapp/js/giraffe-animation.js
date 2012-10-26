Giraffe.X=0;
Giraffe.Y=1;
Giraffe.DEG_TO_RAD = Math.PI/180;

Giraffe.setAnimated = function(canvas) {
  canvas.frame = 0;
  canvas.interval = null;
  canvas.frames = 0;
  canvas.looped = true;
  canvas.animationListeners = new Array();

  canvas.addAnimationListener = function(listener) {
  	this.animationListeners[this.animationListeners.length]=listener;
  }
  canvas.removeAnimationListener = function(listener) {
	for(this.loop=0;this.loop<this.animationListeners.length;this.loop++)
    {
		if(this.animationListeners[this.loop]==listener) {
			this.animationListeners.splice(this.loop,1);
		}
	}
  }

  canvas.startAnimation = function(fps,frames,looped)
  {
    this.frame = 0;
    this.frames = frames;
    this.looped = looped;
    this.interval = setInterval("Giraffe.canvases[\""+this.id+"\"].animate();",1000/fps);
  }

  canvas.stopAnimation = function()
  {
    clearInterval( this.interval );
  }

  canvas.animate = function()
  {
    for(this.loop=0;this.loop<this.animationListeners.length;this.loop++)
    {
      this.animationListeners[this.loop].processFrame(this.frame);
    }
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

/**
 * @class
 */
Giraffe.Transition = function(target,frames) {
	this.frames = frames;
	this.target = target;
	this.canvas = null;
	this.currentFrame=0;
	this.play = false;
	
	this.start = function() {
		this.register();
		this.currentFrame=0;
		this.play=true;
	};
	this.process = function(frame){};
	
	this.processFrame = function() {
		if(this.play==false) { return; };
		this.currentFrame++;
		if(this.currentFrame==this.frames+1) {
			this.unregister();
			this.doNext();
		}
		if(this.currentFrame>this.frames) {
			return false;
		}
		
		this.process(this.currentFrame);
	}
	
	this.doNext = function(){};
	this.register = function(){
		this.canvas.addAnimationListener(this);
	};
	this.unregister = function(){
		this.canvas.removeAnimationListener(this);
	};
}

/**
 * Creates an animation sequence that squashes the x axis of a GraphicsObject
 * @class
 * @param target {GraphicsObject} the GraphicsObject to apply the animation to
 * @param frames integer the number of frames the animation should last for
 */
Giraffe.FlipOutX = function(target,frames) {
	this.frames = frames;
	this.target = target;
	this.canvas = target.canvasParent;
	this.register();
	this.currentFrame=0;

	/**
	 * @private
	 */
	this.process = function(frame) {
		this.target.scaleX = 1-((1*frame)/this.frames);
	}
}
Giraffe.FlipOutX.prototype = new Giraffe.Transition();

Giraffe.FlipInX = function(target,frames) {
	this.frames = frames;
	this.target = target;
	this.canvas = target.canvasParent;
	this.register();
	this.currentFrame=0;

	this.process = function(frame) {
		this.target.scaleX = (1*frame)/this.frames;
	}
}
Giraffe.FlipInX.prototype = new Giraffe.Transition();

Giraffe.FlipOutY = function(target,frames) {
	this.frames = frames;
	this.target = target;
	this.canvas = target.canvasParent;
	this.register();
	this.currentFrame=0;

	this.process = function(frame){
		this.target.scaleY = 1-((1*frame)/this.frames);
	}
}
Giraffe.FlipOutY.prototype = new Giraffe.Transition();

Giraffe.FlipInY = function(target,frames) {
	this.frames = frames;
	this.target = target;
	this.canvas = target.canvasParent;
	this.register();
	this.currentFrame=0;

	this.process = function(frame) {
		this.target.scaleY = (1*frame)/this.frames;
	}
}
Giraffe.FlipInY.prototype = new Giraffe.Transition();

Giraffe.MoveSequence = function(target,frames,matrix) {
	this.frames = frames;
	this.target = target;
	this.matrix = matrix;
	this.canvas = target.canvasParent;
	this.register();
	this.currentFrame=0;

	this.process = function(frame) {
		if(this.matrix) {
			this.target.x+=this.matrix[Giraffe.X];
			this.target.y+=this.matrix[Giraffe.Y];
		} else {
			this.target.x+=this.target.vx;
			this.target.y+=this.target.vy;
		}
	}
}
Giraffe.MoveSequence.prototype = new Giraffe.Transition();

Giraffe.RotationSequence = function(target,frames,steps) {
	this.frames = frames;
	this.target = target;
	this.steps = steps;
	this.canvas = target.canvasParent;
	this.register();
	this.currentFrame=0;

	this.process = function(frame) {
		this.target.setRotation( this.target.rotation+(Giraffe.DEG_TO_RAD*this.steps) );
	}
}
Giraffe.RotationSequence.prototype = new Giraffe.Transition();

Giraffe.ExplodeSequence = function(target,frames) {
	this.frames = frames;
	this.target = target;
	this.canvas = target.canvasParent;
	this.register();
	this.currentFrame=0;

	this.process = function(frame) {
		if(!this.parts) {
			this.parts = getExplodingParts(target);
		}
		
		var hasMinVelocity = false;
		for(i=0;i<this.parts.length;i++) {
			this.parts[i].x+=this.parts[i].vx;
			this.parts[i].y+=this.parts[i].vy;
			this.parts[i].vx*=0.9;
			this.parts[i].vy*=0.9;
			if(this.parts[i].vx>0.5 || this.parts[i].vx<-0.5 ||
				this.parts[i].vy>0.5 || this.parts[i].vy<-0.5) {
				hasMinVelocity=true;
			}
		}
		if(hasMinVelocity==false) {
			this.currentFrame = this.frames;
		}
	}
	
	var getExplodingParts = function(composite,parts) {
		if(!parts) {
			var parts = [];
		}
		for(var i=0;i<composite.parts.length;i++) {
			if(composite.parts[i].parts) { //is sub composite
				getExplodingParts(composite.parts[i],parts);
			}
			composite.parts[i].vx=composite.parts[i].x+((Math.random()*10)-5);
			composite.parts[i].vy=composite.parts[i].y+((Math.random()*10)-5);
			parts[parts.length]=composite.parts[i];
		}
		return parts;
	}
}
Giraffe.ExplodeSequence.prototype = new Giraffe.Transition();
