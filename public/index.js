let startRoomBtn = document.querySelector("#startRoomBtn");
let roomCred = document.querySelector("#roomCred")

startRoomBtn.addEventListener("click", ()=>{
    fetch("/createRoom").then(res=>res.json()).then(data=>{
        window.location.href = `/join.html?id=` + data.id;
    })
})