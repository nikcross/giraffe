loadScript("http://localhost:8181/Tools/GraphicsScripts/Arc.object");
loadScript("http://localhost:8181/Tools/GraphicsScripts/ClearanceCircle2.object");
loadScript("http://localhost:8181/Tools/GraphicsScripts/HeightGuide.object");
loadScript("http://localhost:8181/Tools/GraphicsScripts/Insulator.object");

canvas = new Canvas("canvas");

canvas.add( new HeightGuide(570,20,0,300,780,"50 Meters").setColor("Gray") );
canvas.add( new HeightGuide(560,720,0,300,80,"8 Meters").setColor("Gray") );
canvas.add( new HeightGuide(560,800-(125+80),0,300,125,"12.5 Meters").setColor("Gray") );

canvas.add( new Insulator(400,200,12,52).setColor("Gray").setRotation(2*Math.PI*35/360) );
canvas.add( new Insulator(400,200,12,52).setColor("Gray").setRotation(2*Math.PI*-35/360) );
canvas.add( new ClearanceCircle(400,252,80,0,270).setColor("Gray") );
canvas.add( new ClearanceCircle(400,252,32,0,270).setColor("Gray") );

c = new Composite(400,200,0);
c.add( new ClearanceCircle(0,52,18,0,270).setColor("Gray") );
c.setRotation(2*Math.PI*-35/360);
canvas.add(c);

canvas.add( new Insulator(400,200,12,52) );

canvas.repaint();

println(ClearanceCircle);