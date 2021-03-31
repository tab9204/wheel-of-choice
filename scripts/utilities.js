//event handlers and utility functions used by the main app

//shows the idea selection screen with an animation
function showSelectScreen(selected){
  window.location = "#!/select";
  selectedIdea = selected;
}

function hideKeyboard(){
	document.activeElement.blur();
	$("input").blur();
};

//returns a promise that resolves after a delay
//used mainly for animations
function delayedResolve(delay){
 return new Promise(function(resolve) {
    setTimeout(resolve, delay)
  })
}

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
    m.redraw();//redraw the view
  }
}

function removeItem(event){
  var index = event.target.attributes.dataindex.value;//get the index to remove from the wheel data array
  wheelData.splice(index,1);//remove the item from the specified index
  var updatedData = wheelData.join();//convert the new array to a string
  localStorage.setItem('wheelData', updatedData); //update the stored string

  m.redraw();//redraw the view
}
