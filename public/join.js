let canvas = document.querySelector("#drawCanvas");
let ctx = canvas.getContext("2d"); 

let roomCred = document.querySelector("#roomCred")
let params = new URLSearchParams(window.location.search);
console.log(params.get("id"));

let userID;
let drawColor;

fetch("/joinRoom/" + params.get("id") + "/" + params.get("name")).then(res=>res.json()).then(data=>{
    console.log(data);
   if(data.error==undefined) { 
    userID=data.userID;
    roomCred.innerHTML=`<h5>Room ID: ${data.id} </h5>`;
    roomCred.innerHTML+=`<span>Member joined: ${data.members.length}</span><br />`;
    
    roomCred.innerHTML+=(data.userID!=data.roomAdmin)?`<span>User ID: ${data.userID}</span>`:`<span>User ID: ${data.userID}</span> (You are the room admin!)`;  
    } else {
    roomCred.innerHTML=data.error;
    return;
   }

   switch(data.members.indexOf(data.userID) + 1) {
    case 1:
        drawColor="red";
        break;
    case 2:
        drawColor="orange";
        break;
    case 3:
        drawColor="yellow";
        break;
    case 4:
        drawColor="green";
        break;
    case 5:
        drawColor="blue";
        break;
    case 6:
        drawColor="indigo";
        break;
    case 7:
        drawColor="violet";
        break;
   }

   canvas.width=500;
   canvas.height=500;

   data.drawData.forEach(el=>{
    ctx.fillStyle=el.color;
    ctx.beginPath();
    ctx.arc(el.x, el.y, 5, 0, Math.PI * 2, true); // Right eye
    ctx.fill();
   })
})

canvas.addEventListener("mousemove", (e)=>{
    if(e.button==0) {
        ctx.fillStyle=drawColor;
        ctx.beginPath();
        ctx.arc(e.offsetX, e.offsetY, 5, 0, Math.PI * 2, true); // Right eye
        ctx.fill();

        socket.emit("draw", params.get("id"), {x:e.offsetX, y: e.offsetY, color: drawColor, userID: userID})
    }
})