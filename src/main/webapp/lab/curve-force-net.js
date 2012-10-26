canvas = new Canvas("canvas");

X=0;
Y=1;
origin = [300,400];

function calculateDistance(pointA,pointB) {
  var dX = pointB[X]-pointA[X];
  var dY = pointB[Y]-pointA[Y];
  
  return Math.pow( (dX*dX)+(dY*dY),0.5 );
}

function buildCurve(startPoint,endPoint,attractor,steps,force) {
var vector1 = [
          -(attractor[X] - ((endPoint[X]-startPoint[X])))-startPoint[X],
          -(attractor[Y] - ((endPoint[Y]-startPoint[Y])) )-startPoint[Y]
         ];
var vector2 = [
          endPoint[X]+(attractor[X] - ((endPoint[X]-startPoint[X])) ),
          endPoint[Y]+(attractor[Y] - ((endPoint[Y]-startPoint[Y])) )
         ];

//println("v1:"+vector1[X]+","+vector1[Y]);
//println("v2:"+vector2[X]+","+vector2[Y]);

lastPoint = [startPoint[X],startPoint[Y]];
lastBeam=null;
point = [startPoint[X],startPoint[Y]];

step2 = steps;
stepsSum = ((steps+1)*steps)/2;

for(step1=0.0;step1<=steps;step1++) {
  point[X] = /*point[X]+*/
    ((vector1[X]*step1)/stepsSum)+
    ((vector2[X]*step2)/stepsSum);

  point[Y] = /*point[Y]+*/
    ((vector1[Y]*step1)/stepsSum)+
    ((vector2[Y]*step2)/stepsSum);

println("step1:"+step1+" x:"+lastPoint[X]+" y:"+lastPoint[Y])

/*  canvas.add( new Line(origin[x]+lastPoint[X],origin[Y]-lastPoint[Y],point[X]-lastPoint[X],-point[Y]+lastPoint[Y]) );*/
  
  beam = new Beam(lastPoint[X],lastPoint[Y]);
  if(lastBeam!=null) {
    new Node(lastBeam,[beam]);
  }

  lastBeam = beam;
  lastPoint = [point[X],point[Y]];
  step2--;
}

beam.forceX = force[X];
beam.forceY = force[Y];

}

function calculateNormal(x1,y1,x2,y2) {
  var dx = x2-x1;
  var dy = y2-y1;
  var length = calculateScalar(dx,dy);
  if(length==0) return [0,0];
  return [dy/length,-dx/length];
}

function calculateVector(x1,y1,x2,y2) {
  var dx = x2-x1;
  var dy = y2-y1;
  var length = calculateScalar(dx,dy);
  if(length==0) return [0,0];
  return [dx/length,dy/length];
}

function calculateScalar(x,y) {
  return Math.pow((x*x)+(y*y),0.5)
}

beams = [];
function Beam(x,y) {
  beams[beams.length] = this;

  this.x = x;
  this.y = y;
  this.p = [0,0];

  this.density = 1;

  this.radiusX = 1;
  this.radiusZ = 1;
  this.forceX = 0;
  this.forceY = 0;
  this.sheer = 0;
  this.compression = 0;
  this.maxSheer=10;
  this.maxCompression=10;
  this.maxTension=10;

  this.length = 0;
  this.mass = 0;

  this.calculateMass = function() {
    this.length = calculateScalar(this.x,this.y);
    this.mass = this.density*this.length;
  }

  this.calculateMass();
}

net = [];
function Node(beam,connections) {
  net[net.length] = this;

  this.beam = beam;
  this.connections = connections;
}

//buildCurve([0,0],[100,300],[0,200],10,[-100,0]);
buildCurve([0,0],[100,300],[0,200],10,[0,0]);
buildCurve([-100,0],[100,200],[0,300],10,[0,-50]);

//calculate positions
for(i=0;i<net.length;i++) {
  for(j=0;j<net[i].connections.length;j++) {
    net[i].connections[j].p = [
                    net[i].beam.p[X]+net[i].beam.x,
                    net[i].beam.p[Y]+net[i].beam.y
                              ];
  }
}

//combine close points
println("Beams:"+beams.length);
for(i=0;i<beams.length;i++) {
//println("checking "+i);
for(j=0;j<beams.length;j++) {
  if(i==j) continue;
  if(j.deleted==true) continue;
//println("checking "+i+" with "+j);
  if(calculateDistance(beams[i].p,beams[j].p)<10) {
     //replace beam j with beam i in net
     println("replacing "+i+" with "+j);
     for(n=0;n<net.length;n++) {
       if(net[n].beam==beams[j]) net[n].beam = beams[i];
       for(c=0;c<net[n].connections.length;c++) {
         if(net[n].connections[c]==beams[j]) net[n].connections[c]=beams[i];
       }
     }
     //remove beam j
     beams[j].deleted=true;
  }
}
}
newBeams = [];
for(i=0;i<beams.length;i++) {
  if(beams[i].deleted==true) continue;
  newBeams[newBeams.length]=beams[i];
}
beams=newBeams;

//calculate forces
for(i=0;i<beams.length;i++) {
  //calculate gravity
  beams[i].forceY -= beams[i].mass*10;
}
//run reverse
for(i=net.length-1;i>=0;i--) {
  for(j=net[i].connections.length-1;j>=0;j--) {
    net[i].beam.forceX += (net[i].connections[j].forceX)/net[i].connections.length;
    net[i].beam.forceY += (net[i].connections[j].forceY)/net[i].connections.length;

    println("p"+i+","+j+"="+net[i].beam.forceY);
  }
}


//display structure
for(i=0;i<beams.length;i++) {
  line = new Line( 
    beams[i].p[X]+origin[X],
    origin[Y]-beams[i].p[Y],
    beams[i].x,
    -beams[i].y
  );
  //println("X:"+Math.round(beams[i].p[X]+origin[X])+" Y:"+Math.round(origin[Y]-beams[i].p[Y])+" vX:"+Math.round(beams[i].x)+" vY:"+Math.round(-beams[i].y));

  normal = calculateNormal(
    beams[i].p[X],
    -beams[i].p[Y],
    beams[i].x+beams[i].p[X],
    -beams[i].y-beams[i].p[Y]
  );
  vector = calculateVector(
    beams[i].p[X],
    -beams[i].p[Y],
    beams[i].x+beams[i].p[X],
    -beams[i].y-beams[i].p[Y]
  );

  beams[i].compression=(vector[X]*beams[i].forceX)+(vector[Y]*beams[i].forceY);
  beams[i].sheer=(normal[X]*beams[i].forceX)+(normal[Y]*beams[i].forceY);
  if(beams[i].sheer<0) beams[i].sheer=-beams[i].sheer;  

  text = new Text(
    beams[i].p[X]+origin[X]+(beams[i].x/2),
    origin[Y]-beams[i].p[Y]-(beams[i].y/2),
    "s:"+Math.round(beams[i].sheer*1)/1+" c:"+Math.round(beams[i].compression*1)/1,
    6
  );

  sheer=beams[i].sheer*255/+beams[i].maxSheer;
  compression=beams[i].compression*255/+beams[i].maxCompression;
  tension=-beams[i].compression*255/+beams[i].maxTension;

  if(tension<0) tension=0;
  if(tension>255) tension=255;
  if(compression<0) compression=0;
  if(compression>255) compression=255;
  if(sheer<0) sheer=0;
  if(sheer>255) sheer=255;

  line.color = "rgba("+
    Math.round(compression)+
    ","+
    Math.round(sheer)+
    ","+
    Math.round(tension)+
    ",1)";
  //println("color:"+line.color);

  v = new Line( 
    beams[i].p[X]+origin[X],
    origin[Y]-beams[i].p[Y],
    -vector[X]*beams[i].sheer,
    -vector[Y]*beams[i].sheer
  );

  n = new Line( 
    beams[i].p[X]+origin[X],
    origin[Y]-beams[i].p[Y],
    normal[X]*beams[i].compression,
    normal[Y]*beams[i].compression
  );

  rect = new Rectangle(
    beams[i].p[X]-2+origin[X],
    origin[Y]-beams[i].p[Y]-2
    ,4,4);

  canvas.add(line);
  rect.color = 'rgba(0,0,0,0.5)';
  canvas.add(rect);

  v.color = 'rgba(0,200,0,0.5)';
  //canvas.add(v);
  n.color = 'rgba(200,0,0,0.5)';
  //canvas.add(n);

  canvas.add(text);
}

canvas.repaint();