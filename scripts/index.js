//main script for the app

var data = ["Trey","David","Rie","Andrew"];

window.onload = () =>{
  var root = $("body").get(0);

  m.mount(root, page);

  //init();//initalize the page after the page loads
}

//initalization funciton
function init(){

  if(localStorage.getItem("wheelData")){//if there is wheel data already stored used that
    //data = localStorage.getItem("wheelData").split(",");
  }
  else{//if no data was stored create and store some default data to use
    //localStorage.setItem('wheelData', "Placeholder");
    //data = localStorage.getItem("wheelData").split(",");
  }
}

/****View components****/
var page = {//page content
  view: ()=>{
    return m("div",[
      m(home),
      m(select),
      m(edit)
    ])
  }
}

var home = {//home screen
  oncreate: ()=>{
    initWheel(data);//initalize the wheel with the json data
    attachEventHandlers(); //attach all the event handlers
  },
  view: ()=>{
    return m(".screenView",{id: "mainScreen"},[
      m(".headerContainer",[
        m("img.hidden",{id: "addBtn", src:"./assets/plus.png"}),
        m(".pageHeader","Spin the wheel")
      ]),
      m(".bodyContainer",[
        m("canvas",{id: "myCanvas", resize:"true"})
      ])
    ])
  }
}

var select = {//select screen
  view: ()=>{
    return m(".screenView.hidden",{id: "selectedScreen"},[
      m(".bodyContainer",[
        m("img",{id: "confetti", src:"./assets/confetti.gif"}),
        m("div",{id:"selectedItem"}),
        m("img",{id: "downArrow", src:"./assets/down.png"}),
        m("audio",{id: "audioSource", autoplay:"true"},[
          m("source", {src:"./assets/yay_effect.mp3", type:"audio/mpeg"})
        ]),
      ])
    ])
  }
}

var edit = {//select screen
  view: ()=>{
    return m(".screenView.hidden",{id: "editScreen"},[
      m(".headerContainer",[
        m(".pageHeader","Add items")
      ]),
      m(".bodyContainer",[
        m(".bodySection",[
          m("div","Input an item then press enter to add it to the wheel"),
          m("input", {id:"itemInput", type:"text"})
        ]),
        m(".bodySection",[
          m("div","Wheel sections"),
          m("ul",{id:"wheelLists"},data.map((item) => {
             return m("li",item)
          }))
        ])
      ])
    ])
  }
}
