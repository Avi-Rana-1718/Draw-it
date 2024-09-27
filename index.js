const express = require("express");
const app = express();
const fs = require("fs")
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const session = require("express-session");
const { log, error } = require("console");
const { userInfo } = require("os");
const uuid = require("uuid")

app.use(express.static("./public"));
app.use(session({
    secret:"secertpass",
    resave: false,
    saveUninitialized: true
}))

app.get("/createRoom", (req, res)=>{
    let data = JSON.parse(fs.readFileSync("./data.json"));
    
    let id = req.query.name;
    console.log(req.query);
    
    let roomObj = {
        id: (uuid.v4(Date.now())).substring(0, 6),
        members: [id],
        roomAdmin: id
    }

    data.push(roomObj)
    fs.writeFileSync("./data.json", JSON.stringify(data));
    res.json(roomObj)
})

io.on("connection", (socket)=>{

    // userName is the name of the one requ
    socket.on("init", (roomID, userName)=>{
        io.emit(`getData/${roomID}`);
        socket.on(`sendData`, (roomID, data, senderID)=>{ 
            console.log(senderID, userName);
            
            
            //if(senderID!=userName)
            io.emit(`completeInit/${roomID}/${userName}`, data);
        })
    
    })

    socket.on("join", (roomID, userName)=>{

        let data = JSON.parse(fs.readFileSync("./data.json"));
        let flag=true;
        data = data.map((el)=>{
            if(el.id==roomID && !el.members.includes(userName)) {
                flag=false;
                el.members.push(userName);
                io.emit(`join/${roomID}`, el)
            } else if(el.id==roomID) {
                flag=false;
                io.emit(`join/${roomID}`, el)
            }
            return el;
        })

        if(flag==true) {
            io.emit(`join/${roomID}`, {error: "Room not found!"})
        }

        fs.writeFileSync("./data.json", JSON.stringify(data));
    });

    socket.on("draw", (roomID, data)=>{
        io.emit(`draw/${roomID}`, data);
    })

    socket.on("destroy", (roomID)=>{
        let data = JSON.parse(fs.readFileSync("./data.json"));
        data = data.filter((el)=>{
            return el.id != roomID;
        });
        fs.writeFileSync("./data.json", JSON.stringify(data));
        console.log(`Room (${roomID}) destroyed!`);
        io.emit(`join/${roomID}`, {error: "Room admin ended the session!"})

    });
})

server.listen(3030, ()=>{
    console.log("Server started!");
})