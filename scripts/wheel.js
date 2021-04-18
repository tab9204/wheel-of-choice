//script to create and add functionality to the rotating wheel

//wheelData => the json data the wheel is initalized with
function initWheel(wheelData){
  var canvas = document.getElementById('myCanvas');// Get a reference to the canvas object

  paper.clear();//make sure the view is clear

  paper.setup(canvas);// Create an empty project and a view for the canvas:

  //globals
  var radius = paper.view.bounds.width < paper.view.bounds.height ? (paper.view.bounds.width / 2) - 15 : (paper.view.bounds.height / 2) - 25; //radius of wheel
  var centerPoint = {x:paper.view.center.x,y:paper.view.center.y}; //center point of the wheel
  var numSegments = wheelData.length; //number of segments in the wheel
  var spinningWheel = createWheel(numSegments,centerPoint,radius); //creates the wheel
  var rotation = 0; //used to rotate the wheel
  var friction = 1; //friction to adjust how fast the wheel is spinning
  var minRotation = 4; //the minumum amount of rotation that needs to be input by the user for the wheel to spin
  var spinning = false; //flags if the wheel is spinning or not
  var timeMouseDown = 0; //the timestamp when the mouse down event is triggered

  //vector that is used as a reference point for the mouse to rotate around
  //represents 0 degrees of rotation
  var baseVector = new paper.Point(centerPoint.x - (centerPoint.x + radius), centerPoint.y - centerPoint.y);
  //vector the current mouse location
  var currentMouseVector;
  //vector that points to the new mouse position after the mouse is dragged
  var updatedMouseVector;

  //creates a visual pointer at the top of the wheel
  if(wheelData.length >= 1){
    var pointer = new paper.Path();
    pointer.fillColor = 'black';
    pointer.add(new paper.Point(centerPoint.x, centerPoint.y - radius + 10));
    pointer.add( new paper.Point(centerPoint.x - 30, centerPoint.y - radius - 50));
    pointer.add( new paper.Point(centerPoint.x + 30, centerPoint.y - radius - 50));
    pointer.closed = true;
  }


  // Draw the view now:
  paper.view.draw();

  //on every frame
  paper.view.onFrame = function(event) {
    spinningWheel.rotate(rotation);//rotate the wheel by the rotation amount

    if(rotation < - 0.05){//the wheel is spinning in a negative direction
      rotation = rotation + (0.05 * friction);//increase rotation towards 0
    }
    else if( rotation > 0.05){//the wheel is spinning in a positive direction
      rotation = rotation - (0.05 * friction);//decrease rotation towards 0
    }
    else{

      rotation = 0;

      if(spinning){//if the wheel was spun
        var hit = spinningWheel.hitTest((new paper.Point(centerPoint.x, centerPoint.y - radius + 10)));//detect where the wheel stopped
        var selected = parseInt(hit.item.name.substring("wedge_".length)); //get the int from the wedge name
        getRandomIdea(wheelData,selected);//get a random idea based on the selected number
        spinning = false;
      }
    }
  };

  paper.view.onMouseDown = function(event) {

    friction = 6;//apply friction

    //calculate the current mouse vector for the initial mouse click
    currentMouseVector = new paper.Point(centerPoint.x - event.point.x, centerPoint.y - event.point.y);

  };

  paper.view.onMouseDrag= function(event) {
    //get the updated mouse vector when the mouse is dragged
    updatedMouseVector = new paper.Point(centerPoint.x - event.point.x, centerPoint.y - event.point.y);

    var currentAngleBetween;//the angle between the current mouse vector and the base vector
    var updatedAngleBetween;//the angle between the updated mouse vector and the base vector

    //if the mouse is in quadrants 1 or 2 (0-180 degrees) calculate the angle normally
    if(getQuadrant(event.point, centerPoint) <= 2){
      currentAngleBetween = calcAngle(currentMouseVector,baseVector);
      updatedAngleBetween = calcAngle(updatedMouseVector,baseVector);
    }
    //if the mouse is in quadrant 3 or 4 (180-360 degrees) add 180 to the calculated angle
    else if(getQuadrant(event.point, centerPoint) >= 3){
      currentAngleBetween = 180 + (180 - calcAngle(currentMouseVector,baseVector));
      updatedAngleBetween = 180 + (180 - calcAngle(updatedMouseVector,baseVector));
    }


    //check if there is a difference between the two angles, if so then the mouse was rotated
    if(Math.abs(updatedAngleBetween - currentAngleBetween) >= 1){//check above a threshold so that we dont rotate on tiny increments

      //calculate which direction the wheel should rotate
      var direction = ((updatedAngleBetween - currentAngleBetween) * -1) / (Math.abs(updatedAngleBetween - currentAngleBetween));

      rotation = (event.delta.length / 3) * direction;

      //update the current mouse vector with the updated mouse vector
      currentMouseVector = updatedMouseVector;


    }

  }

  paper.view.onMouseUp = function(event) {

    if(Math.abs(rotation) >= 2){//minumum distance required to have spun the wheel
        spinning = true;
    }

    friction = 2;//remove friction

  };

}

//numSegs => number of segments on the wheel
function createWheel(numSegs,centerPoint,radius){

  var degRotation = 360 / numSegs; //degrees of rotation based on the number of segments in wheel
  var group = new paper.Group(); //group containing all the parts of the wheel
  var numbers = numberArray(numSegs); //array of numbers used to identify each wedge on the wheel

  for(x = 1; x <= numSegs; x++){

    var fillColor;

    if(numSegs % 2 == 0){
      fillColor = x % 2 == 1 ? "#4D77BE" : "#66DF4D";
    }
    else{
      fillColor = x % 3 == 1 ? "#4D77BE" : x % 3 == 2 ? "#66DF4D" : "#FF9D58";
    }

    var wedge = createWedge(centerPoint,radius,degRotation);
    wedge.fillColor = fillColor;

    //get a random number from the numbers array
    var selector = Math.floor(Math.random() * Math.floor(numbers.length));
    wedge.name = 'wedge_'+ numbers[selector]; //add a name to the wedge
    numbers.splice(selector,1);//remove the number from the array so that it cannot be repeated


    wedge.rotate(degRotation * x,centerPoint); //rotate the wedge to form a circle

    //creates text for each wedge
    //only rotates the text if there is more then 1 wedge. text is in the center of the circle if there is a single wedge
    var text = numSegs > 1 ? new paper.PointText(new paper.Point(centerPoint.x + radius / 1.5, centerPoint.y)) : new paper.PointText(new paper.Point(centerPoint.x, centerPoint.y));
    if(numSegs > 1){
      text.rotate((degRotation * x) + (degRotation / 2),centerPoint);
      text.rotate(90);
    }

    text.justification = 'center';
    text.fillColor = 'white';
    text.strokeColor = 'black';
    text.content = x;

    text.strokeWidth = .75;
    text.fontSize = (radius / 5)  < 12 ? 12 : (radius / 5); //font size should be based on wheel radius. minumum 12

    //add the wedge and text to the group
    group.addChild(wedge);
    group.addChild(text);
  }
  return group;
}
//creates the individual wedges of the wheel
function createWedge(center,radius,degrees){
  var wedge = new paper.Path();
  var circlePoint = calculateCoordinates(degrees,radius,center);
  var midPoint = calculateCoordinates(degrees / 2,radius,center)

  wedge.add(new paper.Point(center.x, center.y), new paper.Point(center.x + radius, center.y));
  wedge.add(new paper.Point(center.x, center.y), new paper.Point(circlePoint.x, circlePoint.y));
  wedge.arcTo(new paper.Point(midPoint.x, midPoint.y), new paper.Point(center.x + radius, center.y));

  return wedge;
}

//calculates which way the circle should spin based on how the user swiped
function calculateRotation(swipeVector,endVector,velocity,centerPoint){
  var rotation = velocity; //degrees of rotation
  var direction; //the direction of the rotation

  if(swipeVector.angle >= 0){ // positive angle means a swipe down
    if(endVector.x <= centerPoint.x){//swiped to the left of the wheel
      direction = -1;
    }
    else{//siped to the right of the wheel
      direction = 1;
    }
  }
  else if(swipeVector.angle <= 0){ //negative angle means a swipe up
    if(endVector.x <= centerPoint.x){//swiped to the left of the wheel
      direction = 1;
    }
    else{//siped to the right of the wheel
      direction = -1;
    }
  }

  return Math.floor(rotation * direction);
}

//calculates the x,y coordinates on a circle
function calculateCoordinates(degrees,radius,center){
  //convert the degrees of rotation to radians
  var radians = degrees * (Math.PI / 180);
  //calculate the x and y coordnates
  var x = Math.cos(radians) * radius;
  var y = Math.sin(radians) * radius;
  //return the coordinates
  return {x:center.x + x, y:center.y + y};
}

//generates an array of numbers from 0 to x - 1
//used for numbering the wheel wedges
function numberArray(num){
  var array = [];
  for(x = 0; x <= num - 1; x++){
    array.push(x);
  }
  return array;
}

function value_limit(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}

//selects a random item from the json passed to the wheel
function getRandomIdea(dataList,selector){
  var selectedIdea = dataList[selector];

  //animate the recipe screen
  showSelectScreen(selectedIdea);
}
//returns which quadrant of the circle the mouse is in
function getQuadrant(mouse,center){
  if(mouse.x >= center.x && mouse.y <= center.y){
    return 1;//top right
  }
  else if(mouse.x <= center.x && mouse.y <= center.y){
    return 2;//top left
  }
  else if(mouse.x <= center.x && mouse.y >= center.y){
    return 3;//bottom left
  }
  else if(mouse.x >= center.x && mouse.y >= center.y){
    return 4;//bottom right
  }
}

//calculate the angle between two vectos
function calcAngle(vec1,vec2){
  var dot = (vec1.x * vec2.x) + (vec1.y * vec2.y);
  var mag = vec1.length * vec2.length;
  var angle = Math.acos(dot / mag);

  return angle * (180 / Math.PI);
}
