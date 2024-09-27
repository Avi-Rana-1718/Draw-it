let startRoomBtn = document.querySelector("#startRoomBtn");
let roomCred = document.querySelector("#roomCred")
let nameInput = document.querySelector("#nameInput");
startRoomBtn.addEventListener("click", ()=>{
    localStorage.setItem("name", nameInput.value);
    fetch("/createRoom?name=" + nameInput.value).then(res=>res.json()).then(data=>{
        window.location.href = `/join.html?id=` + data.id;
    })
})