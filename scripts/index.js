//main script for the app

var wheelData = [];//array containing the data for the wheel

window.onload = () =>{
  var root = $("body").get(0);

  m.mount(root, page);
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
    if(localStorage.getItem("wheelData")){//if there is wheel data already stored used that
      wheelData = localStorage.getItem("wheelData").split(",");
    }
    initWheel(wheelData);//initalize the wheel with the json data
  },
  view: ()=>{
    return m(".screenView",{id: "mainScreen"},[
      m(".headerContainer",[
        m("img",{id: "addBtn", src:"./assets/plus.png", onclick: showEditScreen}),
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
    var swipes = {down: hideIdeaScreen};
    var lightboxSwipe = new Swiper($("#selectedScreen").get(0),swipes);
  },
  view: ()=>{
    return m(".screenView.hidden",{id: "selectedScreen"},[
      m(".bodyContainer",[
        m("img",{id: "confetti", src:"./assets/confetti.gif"}),
        m("div",{id:"selectedItem"}),
        m("img",{id: "downArrow", src:"./assets/down.png", onclick: hideIdeaScreen}),
        m("audio",{id: "audioSource", autoplay:"true"},[
          m("source", {src:"./assets/yay_effect.mp3", type:"audio/mpeg"})
        ]),
      ])
    ])
  }
}

var edit = {//edit screen
  view: ()=>{
    return m(".screenView.hidden",{id: "editScreen"},[
      m(".headerContainer",[
        m("img",{id: "addBtn", src:"./assets/back.png", onclick: ()=>{
          hideEditScreen();
          initWheel(wheelData);//reinitalize the wheel
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
