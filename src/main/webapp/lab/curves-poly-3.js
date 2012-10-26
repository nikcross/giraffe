canvas = new Canvas("canvas");

function calculateNormal(x1,y1,x2,y2) {
  var dx = x2-x1;
  var dy = y2-y1;
  var length = Math.pow((dx*dx)+(dy*dy),0.5)
  if(length==0) return [0,0];


  return [dy/length,-dx/length];
}

function calculateCrossProduct(x1,y1,z1,x2,y2,z2) {
/* Cross Product
(x1)   (x2)    (y1z2 - z1y2)
(y1) X (y2) =  (z1x2 - x1z2)
(z1)   (z2)    (x1y2 - y1x2)
*/
  var x = (y1*z2) - (z1*y2);
  var y = (z1*x2) - (x1*z2);
  var z = (x1*y2) - (y1*x2);

  return [x,y,z];
}

x=0;
y=1;

origin = [300,400];

points = [
           [10,0,100,300,0,200],
           [-10,0,80,261,-5,200],
           [-10,0,58,216,20,200],
           [-10,0,40,163,30,170],
           [-10,0,10,0,40,100],
           [-10,0,100,300,-5,300]
           ,
           [-10,0,-100,300,0,200],
           [10,0,-80,261,5,200],
           [10,0,-58,216,-20,200],
           [10,0,-40,163,-30,170],
           [10,0,-10,0,-40,100],
           [10,0,-100,300,5,300]
         ]

for(i=0;i<points.length;i++) {

startPoint = [points[i][0],points[i][1]];
endPoint = [points[i][2],points[i][3]];
attractor = [points[i][4],points[i][5]];
steps = 100.0;

vector1 = [
          -(attractor[x] - ((endPoint[x]-startPoint[x])))-startPoint[x],
          -(attractor[y] - ((endPoint[y]-startPoint[y])) )-startPoint[y]
         ];
vector2 = [
          endPoint[x]+(attractor[x] - ((endPoint[x]-startPoint[x])) ),
          endPoint[y]+(attractor[y] - ((endPoint[y]-startPoint[y])) )
         ];

println("v1:"+vector1[x]+","+vector1[y]);
println("v2:"+vector2[x]+","+vector2[y]);

lastPoint = [startPoint[x],startPoint[y]];
point = [startPoint[x],startPoint[y]];

step2 = steps;
stepsSum = ((steps+1)*steps)/2;

beam = new Polygon(origin[x],origin[y]);

if(i<6) {
  beam.color = "lightblue";
  beam.fillColor = new RadialColor(canvas,"grey","white",0,0,100).getColor();
} else {
  beam.color = new RadialColor(canvas,"green","grey",0,0,100).getColor();
  beam.fillColor = new RadialColor(canvas,"#D0FFD0","#E0E0FF",0,0,100).getColor();
}

for(step1=0;step1<=steps;step1++) {
  point[x] = point[x]+
    ((vector1[x]*step1)/stepsSum)+
    ((vector2[x]*step2)/stepsSum);

  point[y] = point[y]+
    ((vector1[y]*step1)/stepsSum)+
    ((vector2[y]*step2)/stepsSum);

//println("step1:"+step1+" x:"+point[x]+" y:"+point[y])

   beam.addPoint(point[x],-point[y]);

//  canvas.add( new Line(origin[x]+lastPoint[x],origin[y]-lastPoint[y],point[x]-lastPoint[x],-point[y]+lastPoint[y]) );

//canvas.add( new Rectangle(origin[x]+lastPoint[x]-5,origin[y]-lastPoint[y]-5,10,10) );

  lastPoint = [point[x],point[y]];
  step2--;
}

for(;step1>=0;step1--) {
  point[x] = point[x]-
    ((vector1[x]*step1)/stepsSum)-
    ((vector2[x]*step2)/stepsSum);

  point[y] = point[y]-
    ((vector1[y]*step1)/stepsSum)-
    ((vector2[y]*step2)/stepsSum);

   normal = calculateNormal(lastPoint[x],lastPoint[y],point[x],point[y]);

   beam.addPoint(
      point[x]+((steps-step1)*normal[x]/20),
      -point[y]-((steps-step1)*normal[y]/20)
   );

  lastPoint = [point[x],point[y]];
  step2++;
}

canvas.add( beam );
/*
m=new Rectangle(origin[x]+attractor[x]-5,origin[y]-attractor[y]-5,10,10);
m.color = "red";
canvas.add( m );
m= new Rectangle(origin[x]+startPoint[x]-5,origin[y]-startPoint[y]-5,10,10);
m.color = "green";
canvas.add( m );
m= new Rectangle(origin[x]+endPoint[x]-5,origin[y]-endPoint[y]-5,10,10);
m.color = "blue";
canvas.add( m );
*/
}

canvas.repaint();