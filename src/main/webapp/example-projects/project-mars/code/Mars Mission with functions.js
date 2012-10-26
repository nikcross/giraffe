robot.fn = function() {
  robot.forward();
  robot.turnLeft();
  robot.forward();
  robot.forward();
}
robot.fn2 = function(i) {
  for(c=0;c<i;c++) {
    	robot.turnRight();
  }
}
  
robot.fn();
robot.fn2(3);
robot.fn();
robot.fn2(4);
