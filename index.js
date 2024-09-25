const express = require("express");
const app = express();
const fs = require("fs")
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const uuid = require("uuid");
const session = require("express-session")

app.use(express.static("./public"));
app.use(session({
    secret:"secertpass"
}))

app.get("/createRoom", (req, res)=>{
    let data = JSON.parse(fs.readFileSync("./data.json"));

    let roomObj = {
        id: ++data.roomCount,
        members: [req.ip],
        roomAdmin: req.ip,
        drawData: []
    }

    data.roomData.push(roomObj)
    fs.writeFileSync("./data.json", JSON.stringify(data));
    roomObj.adminID = req.ip;
    res.json(roomObj)
})

app.get("/joinRoom/:id", (req, res)=>{    
    let data = JSON.parse(fs.readFileSync("./data.json"));
    // generate userid
    // if(!req.session.id) {
    //     req.session.id =req.ip
    // }
    //check if the room exists

    let nData = data.roomData.filter((el)=>{
        return el.id==req.params.id;
    });

    if(nData.length!=0) {
        // room exists
        // need to update room info
        console.log(nData);

       let uData = nData[0].members.filter((el)=>{
            return el == req.ip;
        })

        if(uData.length==0) {
            let roomObj = {
                id: nData[0].id,
                members: [...nData[0].members, req.ip],
                userID: req.ip,
                drawData: nData[0].drawData
            }
    
            data.roomData = data.roomData.map((el)=>{
                if(el.id==roomObj.id) {
                    el.members = roomObj.members;
                }
    
                return el;
            });

            fs.writeFileSync("./data.json", JSON.stringify(data));
            console.log(`User joined room (${roomObj.id})!`);
            res.json(roomObj);

        } else {
            console.log("User already in room!");
            res.json({
                id: nData[0].id,
                members: [...nData[0].members],
                userID: req.ip,
                drawData: nData[0].drawData
            })
            
        }


    } else {
        res.json({error: "Room not found!"})
    }


})

io.on("connection", (socket)=>{
    console.log("a user connected");


    socket.on("disconnect", ()=>{
        console.log("User disconnected!");
        
    })

    socket.on("draw", (roomID, userID, pos)=>{
        let data = JSON.parse(fs.readFileSync("./data.json"));
        data.roomData = data.roomData.map((el)=>{
            if(el.id==roomID) {
                el.drawData.push({x: pos.x, y: pos.y,color: pos.color, userID: userID})
            }
            return el;
        })

        fs.writeFileSync("./data.json", JSON.stringify(data));
    })
    


})


server.listen(3030, ()=>{
    console.log("Server started!");
})