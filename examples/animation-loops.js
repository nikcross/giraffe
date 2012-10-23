example = { run: function() {
//START
circle =  new Circle(100,100,50).setFillColor("blue");
canvas.add(circle);

circle.animate=createMoveLoop(circle,[1,1],100);
canvas.add(circle);
//END
}}

exampleLoaded();
