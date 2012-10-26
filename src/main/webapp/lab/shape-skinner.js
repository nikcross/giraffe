function isInside(point,shape) {

  var intersects = 0;
  for(var p=0;p<shape.points.length;p++) {
    pointA = shape.points[p];
	pointB = shape.points[(p+1)%shape.points.length];
	
	if( 
	    //point[X]>min(pointA[X],pointB[X]) &&
		point[Y]>min(pointA[Y],pointB[Y]) &&
		point[X]<=max(pointA[X],pointB[X]) &&
		point[Y]<=max(pointA[Y],pointB[Y])
	  ) intersects++;
  }
  //println("intersects:"+intersects);

  if(intersects%2==1 ) return true;
  else return false;
}

function min(a,b) {
  return (a<b)?a:b;
}
function max(a,b) {
  return (a>b)?a:b;
}

function getClosestPointIndex(point,shape,shapeB) {
  var minDistance = 0;
  var closestIndex = -1;
  //println("getClosestPointIndex("+point[X]+","+point[Y]+")");
  for(var i=0;i<shape.points.length;i++) {
    //println("check "+shape.points[i][X]+","+shape.points[i][Y]);
    //println(i+" distance "+getDistance(point,shape.points[i]));
    if( isInside(shape.points[i],shapeB) ) continue;
  
	if( closestIndex==-1 || getDistance(point,shape.points[i])<minDistance ) {
	  closestIndex = i;
	  minDistance = getDistance(point,shape.points[i]);
	}
  }
  //println("Min distance "+minDistance+" index:"+closestIndex);

  return closestIndex;
}

function getDistance(pointA,pointB) {
  var dX = pointB[X]-pointA[X];
  var dY = pointB[Y]-pointA[Y];
  
  return Math.pow( (dX*dX)+(dY*dY),0.5 );
}

function splice(shapeA,startA,endA,shapeB,startB,endB) {

  if(startB==endB) {
    endB=(endB+1)%shapeB.points.length;
  }

  println("Splicing "+shapeA.name+" "+startA+" to "+endA+" with "+shapeB.name+" "+startB+" to "+endB);

  var points = [];
  
  var iA=startA;
  for(var i=0;i<shapeA.points.length;i++) {
    points[points.length] = shapeA.points[iA];
	iA++;
	if(iA==shapeA.points.length) iA=0;
	if(iA==endA) break;
  } 
  
  var iB=startB;
  for(var i=0;i<shapeB.points.length;i++) {
    points[points.length] = shapeB.points[iB];
	iB++;
	if(iB==shapeB.points.length) iB=0;
	if(iB==endB) break;
  } 
  shapeB.points=points;

}

canvas = new Canvas("canvas");
X=0;
Y=1;
points = [];
shapes = [];

function Shape(points,name) {
  this.points=points;
  this.deleted = false;
  this.name = name;
}

for(n=0;n<6;n++) {
shape = new Array();
points = new Array();

steps = 40;
radius = 40;
rads = 2*Math.PI;
dRad = rads/steps;

	rX= (Math.random()*400)-200;
	rY= (Math.random()*140)-70;
	
  for(i=0;i<steps;i++) {
    //r = (Math.random()*30)-15
    r = (Math.random()*8)-4;
    //r =  Math.cos(dRad*i*8)*4;
    //r=0;

    x = Math.cos( dRad*i )*(radius+r);
    y = Math.sin( dRad*i )*(radius+r);
    points[points.length]=[x+rX,y+rY-100];
  }

  shapes[n] = new Shape(points,"Shape:"+n);
}

println("Shapes: "+shapes.length);
for(n=0;n<shapes.length;n++) {

poly = new Polygon(300,200);
poly.color = "blue";
if(n%2==0)
{
  poly.fillColor = "lightBlue";
} else {
  poly.fillColor = "lightGreen";
}
points = shapes[n].points;

println("Shape "+n+" Points:"+points.length);

for(i=0;i<points.length;i++) {
  poly.addPoint( points[i][X],points[i][Y] );
}

canvas.add(poly);
}
/*
points=shapes[0].points
m= new Rectangle(300+points[0][X]-5,200+points[0][Y]-5,10,10);
m.color = "blue";
canvas.add( m );
m= new Rectangle(300+points[1][X]-5,200+points[1][Y]-5,10,10);
m.color = "red";
canvas.add( m );
points=shapes[1].points
m= new Rectangle(300+points[0][X]-5,200+points[0][Y]-5,10,10);
m.color = "blue";
canvas.add( m );
m= new Rectangle(300+points[1][X]-5,200+points[1][Y]-5,10,10);
m.color = "red";
canvas.add( m );
*/

for(r=0;r<2;r++) {
//for each shape
for(n=0;n<shapes.length;n++) {
  if(shapes[n].deleted==true) continue;
  println("Processing shape "+n);
  points = shapes[n].points;

 // for each other shape
  for(m=0;m<shapes.length;m++) {
      if(shapes[n].deleted==true) break;
      if(m==n) continue;
      if(shapes[m].deleted==true) continue;
  
    doDelete = true;
	firstOutsidePoint=-1;
    for(p=0;p<points.length;p++) {
	  if(isInside(points[p],shapes[m])==false) {
	    doDelete=false;
	    if(firstOutsidePoint==-1) {
		  firstOutsidePoint=p;
		}
	  }
	}
	println("First outside point "+firstOutsidePoint)
	
//  if all points inside another shape, delete shape
      if(doDelete==true) {
		println("Shape "+n+" deleted");
        shapes[n].deleted=true;
        break;
      }
  
// for each point
  for(p=0;p<points.length;p++) {
    point = points[(p+firstOutsidePoint)%points.length];
//  if point in another shape
      if( isInside(point,shapes[m]) ) {
//    record previous point as start point
        startPointIndex = ((p-1+firstOutsidePoint)%points.length);
        //startPointIndex = ((p+firstOutsidePoint)%points.length);
		if(startPointIndex<0) startPointIndex=points.length-1;
        startPoint = shapes[n].points[startPointIndex];
		//println("Inside at:"+startPointIndex);
//      contiue round points until outside of other shape
        while( isInside(point,shapes[m]) && p<points.length) {
          p++;
          point = points[(p+firstOutsidePoint)%points.length];
        }
//    record as end point
        endPointIndex=(p+firstOutsidePoint)%points.length;
        endPoint = shapes[n].points[endPointIndex];
		//println("Outside at:"+endPointIndex);
//    swap start and end points to mark outside
        temp=endPoint;
        endPoint=startPoint;
        startPoint=temp;
        temp=endPointIndex;
        endPointIndex=startPointIndex;
        startPointIndex=temp;
		
//    find nearest point to start point in other shape
        startJoinPointIndex = getClosestPointIndex(startPoint,shapes[m],shapes[n]);
//    find nearest point to end point in other shape
        endJoinPointIndex = getClosestPointIndex(endPoint,shapes[m],shapes[n]);
      
//    calculate direction of points order for second shape
      if( 
	    isInside( 
		  shapes[m].points[
		    ((endJoinPointIndex+1)%shapes[m].points.length)
		  ],
		  shapes[n] 
		  )==false
		) {
	    temp = endJoinPointIndex;
		endJoinPointIndex = startJoinPointIndex;
		startJoinPointIndex = temp;
	  }
		
//    remove other shapes points inside this shape
//    splice this shapes points into other shape
        splice(shapes[n],startPointIndex,endPointIndex,shapes[m],startJoinPointIndex,endJoinPointIndex);

//    delete this shape
        shapes[n].deleted=true;
		println("Shape "+n+" deleted");
		break;
      }
	}
   }
  }
  }
println("Finished Processing");
  
for(n=0;n<shapes.length;n++) {
if(shapes[n].deleted==true) continue;

poly = new Polygon(300,200);
poly.color = "black";
poly.fillColor = 'rgba(255,255,255,0.9)';
points = shapes[n].points;

println("Shape "+shapes[n].name+" Points:"+points.length);

for(i=0;i<points.length;i++) {
  //println("p:"+points[i][X]+","+points[i][Y]);
  poly.addPoint( points[i][X],points[i][Y] );
}

canvas.add(poly);
}

canvas.repaint();

//println( "inside:"+isInside([-30,0],shapes[0]) );