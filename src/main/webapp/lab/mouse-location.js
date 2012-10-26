canvas = new Canvas("canvas");
canvas.x = ui.findLayerPosition(canvas.canvasElement)[0];
canvas.y = ui.findLayerPosition(canvas.canvasElement)[1];

title = new Text(30,30,"Mouse Location",20);
canvas.add( title );

myText = new Text(30,50,"x:-- y:--",10)
myText.animate = function(frame) {
  x=mouse.x-canvas.x;
  y=mouse.y-canvas.y;
  this.text="x:"+x+" y:"+y+" frame:"+frame+" distance:"+myLine.distance;
}
canvas.add( myText );

myCircle = new Circle(200,80,10);
myCircle.color="black";
myCircle.animate = function(frame) {
  this.x=mouse.x-canvas.x;
  this.y=mouse.y-canvas.y;

  myLine.x2=(mouse.x-canvas.x)-myLine.x;
  myLine.y2=(mouse.y-canvas.y)-myLine.y;
  myLine.distance = Math.round( 
    Math.pow( (myLine.x2*myLine.x2)+(myLine.y2*myLine.y2),0.5)
  );

  myText.x = this.x;
  myText.y = this.y;
}
myCircle.onPress =  function()
{
  myCircle.color="red";

  myLine.x=(mouse.x-canvas.x);
  myLine.y=(mouse.y-canvas.y);
}
myCircle.onRelease =  function()
{
  myCircle.color="green";
}
document.onmousedown = myCircle.onPress;
document.onmouseup = myCircle.onRelease;
canvas.add( myCircle );

myLine = new Line(0,0,0,0);
myLine.distance=0;
canvas.add(myLine);

canvas.startAnimation(10,40,true);
println("Done");