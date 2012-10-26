canvas = new Canvas("canvas");

x=0;
y=1;

origin = [300,400];

points = [
           [0,0,100,300,0,200],
           [-40,0,65,261,0,100],
           [-40,0,38,216,0,100],
           [-40,0,18,163,0,100],
           [-40,0,0,0,80,100],
           [-40,0,100,300,0,200],
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

for(step1=0.0;step1<=steps;step1++) {
  point[x] = point[x]+
    ((vector1[x]*step1)/stepsSum)+
    ((vector2[x]*step2)/stepsSum);

  point[y] = point[y]+
    ((vector1[y]*step1)/stepsSum)+
    ((vector2[y]*step2)/stepsSum);

println("step1:"+step1+" x:"+point[x]+" y:"+point[y])

  canvas.add( new Line(origin[x]+lastPoint[x],origin[y]-lastPoint[y],point[x]-lastPoint[x],-point[y]+lastPoint[y]) );

//canvas.add( new Rectangle(origin[x]+lastPoint[x]-5,origin[y]-lastPoint[y]-5,10,10) );

  lastPoint = [point[x],point[y]];
  step2--;
}

m=new Rectangle(origin[x]+attractor[x]-5,origin[y]-attractor[y]-5,10,10);
m.color = "red";
canvas.add( m );
m= new Rectangle(origin[x]+startPoint[x]-5,origin[y]-startPoint[y]-5,10,10);
m.color = "green";
canvas.add( m );
m= new Rectangle(origin[x]+endPoint[x]-5,origin[y]-endPoint[y]-5,10,10);
m.color = "blue";
canvas.add( m );

}

canvas.repaint();