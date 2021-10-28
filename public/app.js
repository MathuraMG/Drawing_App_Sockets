//Open and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', () => {
  console.log("Connected");
});

//EXTRA - add a list of users who are joining
socket.on('userJoined', (data) => {
  let userNames = document.getElementById('users-list');
  let userNameLi = document.createElement('li');
  userNameLi.innerHTML = data.user + " joined."
  userNames.appendChild(userNameLi);
})


window.addEventListener('load',  () => {
  //EXTRA - getuser name
  let userName = window.prompt("Enter your username");
  console.log(userName);

  //Check if a name was entered
  if (userName){
      //Emit Msg to join the room
      let data = {"user": userName};
      socket.emit('userJoined', data);
  }
  else {
      alert("Please refresh and enter a user name");
  }
})


function setup () {
  let canvas = createCanvas(500,500);
  canvas.parent("canvas-container")
  background("#3d5a80");
}

function mouseDragged() {
  mousePos = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mousePosition', mousePos);
}

function drawEllipse(x,y) {
  ellipse(x, y, 20, 20);
}

socket.on('mousePosition', (data, err) => {
  drawEllipse(data.x, data.y);
})
