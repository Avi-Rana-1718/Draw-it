let canvas = document.querySelector("#drawCanvas");
let ctx = canvas.getContext("2d"); 

let roomCred = document.querySelector("#roomCred");
let memberList = document.querySelector("#memberList");
let destoryBtn = document.querySelector("#destroyBtn");

let params = new URLSearchParams(window.location.search);

let roomID=params.get("id");
let adminID;
let drawColor;
let drawData=[];

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "white";
ctx.fill();

if(localStorage.getItem("name")==null) {
    localStorage.setItem("name", prompt("Enter a name", ""));
}

socket.emit("join", params.get("id"), localStorage.getItem("name"));
// socket.emit("init", params.get("id"), localStorage.getItem("name"));

socket.on(`draw/${params.get("id")}`, (data)=>{
    drawData.push(data);

    ctx.fillStyle=data.color;
    ctx.beginPath();
    ctx.arc(data.x, data.y, 5, 0, Math.PI * 2, true);
    ctx.fill();
})

socket.on(`join/${params.get("id")}`, (data)=>{

    if(data.error==undefined) {
        adminID=data.roomAdmin;
        drawColor=getColor(data.members.indexOf(localStorage.getItem("name"))+1);
        roomCred.innerHTML=`<span>Room ID: ${data.id}<span><br/>`;
        roomCred.innerHTML+=`<span>Members: ${data.members.length}</span><br/>`;
        roomCred.innerHTML+=(adminID!=localStorage.getItem("name"))?`<span>User ID: ${localStorage.getItem("name")}</span>`:`<span>User ID: ${localStorage.getItem("name")}<br/> (You are the room admin)</span>`
        memberList.innerHTML=null

        data.members.forEach((el, index)=>{
            let li = document.createElement("li");
            li.innerHTML = "#" + (index+1) + " " + el + ` <span class="colorCircle" style="background-color: ${getColor(index + 1)}">${getColor(index + 1)}</span>`;
            memberList.appendChild(li)
        });

        if(localStorage.getItem("name")!=adminID) {
            destoryBtn.style.display="none";
        }

    } else {
        roomCred.innerHTML = data.error;
        memberList.innerHTML="<li>Session ended</li>";
        memberList.innerHTML+="<li>No members!</li>";
    }  
});

socket.on(`getData/${params.get("id")}`, ()=>{
    console.log("Data request received!");
    //console.log("Draw Data: " + drawData);
    
    socket.emit(`sendData`, roomID, drawData, localStorage.getItem("name"))
})

socket.on(`completeInit/${roomID}/${localStorage.getItem("name")}`, (data)=>{
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
            ctx.arc(e.offsetX, e.offsetY, 100, 0, Math.PI * 2, true);
            ctx.fill();
            socket.emit("draw", params.get("id"), {x:e.offsetX, y: e.offsetY, color: "white"})
        }
})

canvas.addEventListener("touchmove", (e)=>{
        ctx.fillStyle=drawColor;
        ctx.beginPath();
        ctx.arc(e.changedTouches[0].clientX, e.changedTouches[0].clientY, 5, 0, Math.PI * 2, true);
        ctx.fill();
        socket.emit("draw", params.get("id"), {x:e.changedTouches[0].clientX, y: e.changedTouches[0].clientY, color: drawColor})
});

function getColor(index) {
    let color;
    switch(index%7) {
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
        default:
            color="grey";
       }

       return color;
}

destoryBtn.addEventListener("click", ()=>{
    socket.emit("destroy", roomID);
    alert("Session ended by room admin!")
});
