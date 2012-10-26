function camoflageLine(x1,x2,y,poly,steps,randX,randY) {

step = (x2-x1)/steps;

  for(x=x1;x<x2;x+=step) {
    pX = x + ((Math.random()*randX)-(randX/2));
    pY = y + ((Math.random()*randY)-(randY/2));
    if(pX+x1<x1) pX=0;
    if(pX+x1>x2) pX=x2-x1;

    poly.addPoint(pX+x1,pY);
  }

}

canvas = new Canvas("canvas");

pic = new Picture(0,0,"/OpenForum/Images/sky-blue.jpg");
canvas.add(pic);

colourSkyA = 'rgba(200,230,255,0.6)';
colourSkyB = 'rgba(200,230,255,0.8)';
colourTree = 'rgba(50,150,0,0.7)';
colourGround = 'rgba(0,50,0,0.8)';

polySky = new Polygon(250,400);
polySky.color=colourSky;
polySky.fillColor=polySky.color;
polySky.addPoint(0,0);
polySky.addPoint(50,0);
polySky.addPoint(40,-300);
polySky.addPoint(10,-300);

polySkyB = new Polygon(250,400);
polySkyB.color=colourSkyB;
polySkyB.fillColor=polySky.color;
polySkyB.addPoint(4,0);
polySkyB.addPoint(46,0);
polySkyB.addPoint(36,-300);
polySkyB.addPoint(6,-300);

polyTree = new Polygon(250,400);
polyTree.color=colourTree;
polyTree.fillColor=polyTree.color;
polyTree.addPoint(50,0);
polyTree.addPoint(00,0);
polyTree.addPoint(3,-100);
camoflageLine(3,47,-100,polyTree,30,5,10);
polyTree.addPoint(47,-100);

polyGround = new Polygon(250,400);
polyGround.color=colourGround;
polyGround.fillColor=polyGround.color;
polyGround.addPoint(50,0);
polyGround.addPoint(0,0);
polyGround.addPoint(1,-30);
camoflageLine(1,49,-30,polyGround,30,5,10);
polyGround.addPoint(49,-30);

canvas.add(polySkyB);
canvas.add(polySky);
canvas.add(polyTree);
canvas.add(polyGround);

canvas.repaint();