//main script for the app

var wheelData = [];//array containing the data for the wheel

var selectedIdea;

window.onload = () =>{

  //set up the service worker once the page loads
  if ('serviceWorker' in navigator) {navigator.serviceWorker.register('service-worker.js');}
  
  var root = $("body").get(0);

  window.location = "#!/home";

  m.route(document.body, "/home", {
    "/home": home,
    "/select": select,
    "/edit": edit
  })
}

/****View components****/
var home = {//home screen
  oncreate: ()=>{
    if(localStorage.getItem("wheelData")){//if there is wheel data already stored used that
      wheelData = localStorage.getItem("wheelData").split(",");
    }

    initWheel(wheelData);//initalize the wheel with the json data
  },
  onbeforeremove: ()=>{
    return delayedResolve(700); //wait for the animation before removing the view from the dom
  },
  view: ()=>{
    return m(".screenView",{id: "mainScreen"},[
      m(".headerContainer",[
        m("img",{id: "addBtn", src:"./assets/plus.png", onclick:()=>{window.location = "#!/edit";}}),
        m(".pageHeader","Spin the wheel")
      ]),
      m(".bodyContainer",[
        m("canvas",{id: "myCanvas", resize:"true"})
      ])
    ])
  }
}

var select = {//select screen
  oncreate: ()=>{
    var swipes = {down: ()=>{window.location = "#!/home";}};
    var lightboxSwipe = new Swiper($("#selectedScreen").get(0),swipes);

    $("#selectedScreen").addClass("slideUp"); //animate the screen up when the view is created

    //reduce audio and plays
    var audio = $("#audioSource");
    audio.volume = 0.5;
  },
  onbeforeremove: ()=>{
    $("#selectedScreen").addClass("slideDown");//animate the view down

    return delayedResolve(700);//delay removal for the animation
  },
  view: ()=>{
    return m(".screenView",{id: "selectedScreen"},[
      m(".bodyContainer",[
        m("img",{id: "confetti", src:"./assets/confetti.gif"}),
        m("div",{id:"selectedItem"}, selectedIdea),
        m("img",{id: "downArrow", src:"./assets/down.png", onclick: ()=>{window.location = "#!/home";}}),
        m("audio",{id: "audioSource", autoplay:"true"},[
          m("source", {src:"./assets/yay_effect.mp3", type:"audio/mpeg"})
        ]),
      ])
    ])
  }
}

var edit = {//edit screen
  oncreate: ()=>{
    $("#editScreen").addClass("slideUp"); //animate the screen up when the view is created
  },
  onbeforeremove: ()=>{
    $("#editScreen").addClass("slideDown");//animate the view down

    return delayedResolve(700);//delay removal for the animation
  },
  view: ()=>{
    return m(".screenView",{id: "editScreen"},[
      m(".headerContainer",[
        m("img",{id: "addBtn", src:"./assets/back.png", onclick: ()=>{
          //before swapping screens wait briefly for the mobile keyboard to close
          setTimeout(function(){
             window.location = "#!/home";
           }, 100);
        }}),
        m(".pageHeader","Add items")
      ]),
      m(".bodyContainer",[
        m(".bodySection",[
          m("div","Input an item then press enter to add it to the wheel"),
          m("input", {id:"itemInput", type:"text", onkeyup: addNewItem})
        ]),
        m(".bodySection",[
          m("div","Click on the item to remove it from the wheel"),
          m("ul",{id:"wheelLists"},wheelData.map((item,index) => {
             return m("li",{dataIndex: index, onclick: (e) =>{removeItem(e);}},item)
          }))
        ])
      ])
    ])
  }
}
