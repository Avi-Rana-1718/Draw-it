let canvas = document.querySelector("#drawCanvas");
let ctx = canvas.getContext("2d"); 

let roomCred = document.querySelector("#roomCred");
let memberList = document.querySelector("#memberList");

let params = new URLSearchParams(window.location.search);

let roomID=params.get("id");
let adminID;
let drawColor;
let drawData=[];

canvas.width=500;
canvas.height=500;

socket.emit("join", params.get("id"), params.get("name"));
socket.emit("init", params.get("id"), params.get("name"));

socket.on(`draw/${params.get("id")}`, (data)=>{
    drawData.push(data);

    ctx.fillStyle=data.color;
    ctx.beginPath();
    ctx.arc(data.x, data.y, 5, 0, Math.PI * 2, true);
    ctx.fill();
})

socket.on(`join/${params.get("id")}`, (data)=>{

    if(data.error==undefined) {
        console.log(data);
        
        adminID=data.roomAdmin;
        drawColor=getColor(data.members.indexOf(params.get("name"))+1);
        roomCred.innerHTML=`<span>Room ID: ${data.id}<span><br/>`;
        roomCred.innerHTML+=`<span>Members: ${data.members.length}</span><br/>`;
        roomCred.innerHTML+=(adminID!=params.get("name"))?`<span>User ID: ${params.get("name")}</span>`:`<span>User ID: ${params.get("name")} (You are the room admin)</span>`
        memberList.innerHTML=null

        data.members.forEach((el, index)=>{
            let li = document.createElement("li");
            li.innerHTML = el + ` <span class="colorCircle" style="background-color: ${getColor(index + 1)}">${getColor(index + 1)}</span>`;
            memberList.appendChild(li)
        })
    } else {
        roomCred.innerHTML = data.error;
    }  
});

socket.on(`getData/${params.get("id")}`, ()=>{
    console.log("Data request received!");
    //console.log("Draw Data: " + drawData);
    
    socket.emit(`sendData`, roomID, drawData, params.get("name"))
})

socket.on(`completeInit/${roomID}/${params.get("name")}`, (data)=>{
    console.log(9);
    
    console.log(data);
    
    
})

canvas.addEventListener("mousemove", (e)=>{
        if(e.which==1) {            
            ctx.fillStyle=drawColor;
            ctx.beginPath();
            ctx.arc(e.offsetX, e.offsetY, 5, 0, Math.PI * 2, true);
            ctx.fill();
            socket.emit("draw", params.get("id"), {x:e.offsetX, y: e.offsetY, color: drawColor})
        } else if (e.which==3) {
            e.preventDefault();
            ctx.fillStyle="white";
            ctx.beginPath();
            ctx.arc(e.offsetX, e.offsetY, 10, 0, Math.PI * 2, true);
            ctx.fill();
            socket.emit("draw", params.get("id"), {x:e.offsetX, y: e.offsetY, color: "white"})
        }
})

function getColor(index) {
    console.log(index);
    
    let color;
    switch(index) {
        case 1:
            color="red";
            break;
        case 2:
            color="orange";
            break;
        case 3:
            color="yellow";
            break;
        case 4:
            color="green";
            break;
        case 5:
            color="blue";
            break;
        case 6:
            color="indigo";
            break;
        case 7:
            color="violet";
            break;
       }
       
       return color;
}