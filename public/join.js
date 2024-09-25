let canvas = document.querySelector("#drawCanvas");
let ctx = canvas.getContext("2d"); 

let roomCred = document.querySelector("#roomCred")
let params = new URLSearchParams(window.location.search);
console.log(params.get("id"));

let userID;

fetch("/joinRoom/" + params.get("id")).then(res=>res.json()).then(data=>{
    console.log(data);
   if(data.error==undefined) { 
    userID=data.userID;
    roomCred.innerHTML=`<h5>Room ID: ${data.id} </h5>`;
    roomCred.innerHTML+=`<span>Member joined: ${data.members.length}</span><br />`;
    roomCred.innerHTML+=`<span>User ID: ${data.userID}</span>`
   } else {
    roomCred.innerHTML=data.error;
   }

   canvas.width=500;
   canvas.height=500;

   data.drawData.forEach(el=>{
    ctx.beginPath();
    ctx.arc(el.x, el.y, 5, 0, Math.PI * 2, true); // Right eye
    ctx.fill();
   })
})

canvas.addEventListener("mousemove", (e)=>{
    if(e.button==0) {
        ctx.beginPath();
        ctx.arc(e.offsetX, e.offsetY, 5, 0, Math.PI * 2, true); // Right eye
        ctx.fill();

        socket.emit("draw", params.get("id"), userID, {x:e.offsetX, y: e.offsetY})
    }
})