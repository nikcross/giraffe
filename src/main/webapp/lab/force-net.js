canvas = new Canvas("canvas");

X=0;
Y=1;
origin = [300,300];

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
  this.mass = 2;
  this.radiusX = 1;
  this.radiusY = 1;
  this.forceX = 0;
  this.forceY = 0;
  this.sheer = 0;
  this.compression = 0;
  this.maxSheer=10;
  this.maxCompression=10;
  this.maxTension=10;
}

function Node(beam,connections) {
  this.beam = beam;
  this.connections = connections;
}

beamA = new Beam(0,100);
beamB = new Beam(0,50);
beamC = new Beam(20,50);
beamD = new Beam(-50,50);
beamD2 = new Beam(-180,50);
beamE = new Beam(-50,50);
beamF = new Beam(20,50);
beamG = new Beam(0,50);

beamA.p = [0,0];
beamG.forceX=10;
beamC.forceX=10;
beamD.forceX=-100;
beamG.forceX=50;
beamD2.forceX=-50;

net = [];
net[0] = new Node(beamA,[beamB]);
net[1] = new Node(beamB,[beamC,beamD,beamD2]);
net[2] = new Node(beamC,[beamE]);
net[3] = new Node(beamD,[beamF]);
net[4] = new Node(beamE,[beamG]);
net[5] = new Node(beamF,[beamG]);

//calculate positions
for(i=0;i<net.length;i++) {
  for(j=0;j<net[i].connections.length;j++) {

    net[i].connections[j].p = [
                    net[i].beam.p[X]+net[i].beam.x,
                    net[i].beam.p[Y]+net[i].beam.y
                              ];
  }
}

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

  beams[i].sheer=(vector[X]*beams[i].forceX)+(vector[Y]*beams[i].forceY);
  beams[i].compression=(normal[X]*beams[i].forceX)+(normal[Y]*beams[i].forceY);
 
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
  println("color:"+line.color);

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
  canvas.add(v);
  n.color = 'rgba(200,0,0,0.5)';
  canvas.add(n);

  canvas.add(text);
}

canvas.repaint();