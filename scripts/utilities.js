//event handlers and utility functions used by the main app

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


function showEditScreen(){
  $("#editScreen").show();
  $("#editScreen").animate({top: '0px'},500);
}

function hideEditScreen(){
  $("#editScreen").animate({top: '100%'},500,function(){
    $("#selectedScreen").hide();
  });
}

function hideKeyboard(){
	document.activeElement.blur();
	$("input").blur();
};

function addNewItem(event){
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();

    var storedData = localStorage.getItem("wheelData") ? localStorage.getItem("wheelData") : "";

    var inputData = event.target.value;

    if(inputData !== ""){//add the input value if it is not empty
      if(storedData !== ""){//check if there is any data already stored
        storedData = storedData + "," + inputData;//if so add the new item to the string

        localStorage.setItem('wheelData', storedData);//then add the updated string to the storage
      }
      else if(storedData == ""){//if no data is already stored
        localStorage.setItem('wheelData', inputData); //add the input item to the storage
      }
      $(event.target).val("");//reset the textbox to be empty
      wheelData = localStorage.getItem("wheelData").split(",");//set the wheel data to the new data
    }
  }
}

function removeItem(event){
  var index = event.target.attributes.dataindex.value;//get the index to remove from the wheel data array
  wheelData.splice(index,1);//remove the item from the specified index
  var updatedData = wheelData.join();//convert the new array to a string
  localStorage.setItem('wheelData', updatedData); //update the stored string
}
