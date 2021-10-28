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
  let canvas = createCanvas(window.innerWidth,0.7*window.innerHeight);
  canvas.parent("canvas-container")
  background("#3d5a80");
}

function mouseDragged() {
  mousePos = {
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY
  }
  socket.emit('mousePosition', mousePos);
}

function drawEllipse(px, py, x, y) {
  noFill();
  stroke(255);
  strokeWeight(10);
  line(px, py, x, y);
}

socket.on('mousePosition', (data, err) => {
  drawEllipse(data.px, data.py, data.x, data.y);
})
