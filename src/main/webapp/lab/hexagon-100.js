canvas = new Canvas("canvas");

function Hexagon100(x,y)
{
  this.x=x;
  this.y=y;

  this.draw = function()
  {
    if(this.fillColor!=null)
    {
      this.canvas.fillStyle = this.fillColor;
    }
    this.canvas.strokeStyle = this.color;
this.canvas.beginPath();
    this.canvas.lineTo(50,0,this.width,this.height);
    this.canvas.lineTo(25,43,this.width,this.height);
    this.canvas.lineTo(-25,43,this.width,this.height);
    this.canvas.lineTo(-50,0,this.width,this.height);
    this.canvas.lineTo(-25,-43,this.width,this.height);
    this.canvas.lineTo(25,-43,this.width,this.height);
this.canvas.closePath();
    if(this.fillColor!=null)
    {
      this.canvas.fill(0,0,this.width,this.height);
    }
    this.canvas.stroke(); 
  }
}
Hexagon100.prototype = new GraphicsObject();

for(x=0;x<600;x+=75) {
for(y=0;y<400;y+=86) {
  if(x%(75*2)==0) {
    h1 = new Hexagon100(x,y);
  } else {
    h1 = new Hexagon100(x,y+43);
  }
    h1.scale=0.1;
    h1.color="#FFFF00";
    h1.fillColor="#FFAA00";
  canvas.add( h1 );
}
}

canvas.startAnimation();

println("Done");