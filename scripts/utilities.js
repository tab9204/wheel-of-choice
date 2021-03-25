//event handlers and utility functions used by the main app

//set up event handlers
function attachEventHandlers(){
  var ideaScreen =  $("#selectedScreen");
  var downButton = $("#downArrow");
  var addButton = $("#addBtn");
  var itemInput = $("#itemInput");

  var initialX = null;
  var initialY = null;
  //swipe commands
  ideaScreen.on("touchstart", startTouch);
  ideaScreen.on("touchmove", moveTouch);

  downButton.on("click",() => hideIdeaScreen());

  addButton.on("click",() => showEditScreen());

  itemInput.on("keyup", (e) => addNewItem(e));
};

function startTouch(e) {
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
};

function moveTouch(e) {
  if (initialX === null) {
    return;
  }
  if (initialY === null) {
    return;
  }
  var currentX = e.touches[0].clientX;
  var currentY = e.touches[0].clientY;
  var diffX = initialX - currentX;
  var diffY = initialY - currentY;
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // sliding horizontally
    if (diffX > 0) {
      // swiped left
      console.log("swiped left");
    } else {
      // swiped right
      console.log("swiped right");
    }
  } else {
    // sliding vertically
    if (diffY > 0) {
      // swiped up
        console.log("swiped up");
    } else {
      // swiped down
      hideIdeaScreen();
    }
  }
  initialX = null;
  initialY = null;
  e.preventDefault();
};

//hides the idea selection screen with an animation
function hideIdeaScreen(){
  $("#selectedScreen").animate({top: '100%'},500,function(){
    $("#ideaUrl").html("");
    $("#selectedItem").html("");
    $("#selectedScreen").hide();
  });
}
//shows the idea selection screen with an animation
function showIdeaScreen(){
  $("#selectedScreen").show();
  $("#selectedScreen").animate({top: '0px'},500);
  var audio = document.getElementById("audioSource");
  audio.volume = 0.5;
  audio.play();
}

//shows the idea selection screen with an animation
function showEditScreen(){
  $("#editScreen").show();
  $("#editScreen").animate({top: '0px'},500);
}

function addNewItem(event){
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    console.log("enter");
  }
}
