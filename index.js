const {
  SERVER_URL ,
  PORT ,
  USER_CONNECTED ,
  DISCONNECTED, 
  CONNECTION,
  HISTORY_CALL ,
  USER_JOIN ,
  LEADER_VOTE,
  WORKSTARTING, 
  DRAWINGDATA,
  //save 
  SAVE_CONFIRM ,
  SAVE_RESULT ,
  // // drawing 
  LINEDRAWING,
  CIRCLEDRAWING, 
  TEXTDRAWING ,
  RECTDRAWING ,
  EPSDRAWING ,
  PENDRAWING ,
 
  CLEARCANVAS,
  CANVAS_UPDATE
} = require('./constants');


var cors = require('cors');
var express = require('express');
var app = express();
var path = require('path');
const fs = require('fs');
var http = require('http').createServer(app);
var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 ,// For legacy browser support
  methods: "GET,POST, PUT"
}

app.use(cors(corsOptions));
//app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

const bodyParser = require('body-parser');


let socketlists = {};
let workingUserLists = {};
let totalUserData=[];
let historyData=[];
let votedUserList = {};
let totalUserCount = 0;
let voteCount = 0;
let jsonFileName = '';
let workingLeader = '';
let JsonSaveYes=1;
var JsonSaveCount =1;
let saveAgreeCount = 1;
let saveConfirmCount = 1;
let maxCountUser = "";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/signin', (req, res) => {
 
  let username = req.body.user;
  console.log("username---",username);
  if (socketlists[username] == undefined) {
      res.send("OK");
  } else {
      res.send("err");
  }
});
const io = require('socket.io')(http, {
  cors: {
      origin: 'http://localhost:8080',
      methods: ["GET", "POST"]
  },
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

var server=http.listen(PORT,function(){
  var host = server.address().address
   var port = server.address().port
   
   console.log("whiteboard app listening at http://%s:%s", host, port)
});

io.on(CONNECTION, (socket) => {
  console.log('a user connected');
  socket.on(USER_CONNECTED, (newUser) => {
    if(socketlists[newUser]!=undefined){
      console.log("totalUserData---------")
      socket.emit("ERROR",true);
    }
    else {
          console.log(`new user connected -- ${newUser}`);
          if (workingLeader){
            console.log("workinguserlist",workingUserLists)
            io.emit("LEADERNAME",workingLeader);
            io.emit("WORKINGUSERLIST",workingUserLists);
            socket.emit(WORKSTARTING,workingLeader);
          }
          for (let currentUser in socketlists) {
            socket.emit(USER_CONNECTED, currentUser);
          }
          socketlists[newUser] = socket.id;
          let newUserdata = {"username":newUser,socketId:socket.id}
          totalUserData.push(newUserdata);
          console.log("totalUserData",totalUserData)
          totalUserCount ++;
                   
          socket.broadcast.emit(USER_CONNECTED, newUser);
      } 
});
  socket.on('disconnect', () => {
    var disconnecteUserId= socket.id;
    disconnect(disconnecteUserId);
  });

socket.on("JSONSAVE",(filname) => {
  console.log("JSONSAVE")
  socket.broadcast.emit("JSONSAVE",filname);
  jsonFileName= filname;
})
socket.on("JSONSAVECONFIRM",(data) =>{
  console.log("JSONSAVECONFIRM")
     JsonSaveCount ++ ;
    if(data){
     JsonSaveYes ++;
    }
    if(JsonSaveCount ==totalUserCount ){
      if (JsonSaveYes > JsonSaveCount/2){
        jsonFileSave();
      }
    }
})
socket.on("JSONUPLOAD",(filname) => {
  jsonUpload(filname)

})
function jsonUpload(filname) {
  console.log("JSONUPLOAD")
  fs.readFile(filname+ '.json', (err, data1) => {
    if (err) throw err;

    let drawData = JSON.parse(data1);
    for (const [key, data] of Object.entries(drawData)) {
      for (let type in data) {
        console.log("drawData-----",drawData,"---type----", type,"----value----",data[type],"--data--",historyData)
        io.emit(type,data[type]);
        io.emit(CANVAS_UPDATE, true);
       }
     
    }
    historyData.push(drawData);
    
});
}
function vote(data){
  var votedUser,username;
 
  for (const [key, val] of Object.entries(data)) {
    if (key=="username")username=val
    else votedUser = val  
  }
  io.emit(LEADER_VOTE,username);
  if (votedUserList[votedUser] != undefined) {
      votedUserList[votedUser] = votedUserList[votedUser] + 1;
  } else {
      votedUserList[votedUser] = 1;
  }
  voteCount ++;
  if (voteCount==1){
    maxCountUser=votedUser
  }
  if(votedUserList[maxCountUser]<votedUserList[votedUser])
  {
    maxCountUser = votedUser;
  }
  if (voteCount == totalUserCount) {
     
      workingLeader = maxCountUser;
      io.emit(WORKSTARTING, workingLeader);
  }
}
function jsonFileSave(){
     console.log("jsonFileSave")
     console.log("historydata",historyData)
    let data = JSON.stringify(historyData);
    console.log("jsondatt",data)
    fs.writeFileSync(jsonFileName+'.json', data);
    JsonSaveCount=1;
    JsonSaveYes=1;
    
}
function save(data){
  if(data) saveAgreeCount ++;
    saveConfirmCount ++;
    if(saveConfirmCount==totalUserCount){
      if (saveAgreeCount > saveConfirmCount/2){
            saveAgreeCount=1;
            saveConfirmCount =1;
        io.emit(SAVE_RESULT, true);
      } else{
        io.emit(SAVE_RESULT, false);
      }
    }
}
function history (workinguser){
  for (const [key, data] of Object.entries(historyData)) {
    for (let type in data) {
      socket.emit(type,data[type]);
      socket.emit(CANVAS_UPDATE, true);
     }
   
  }
}
function disconnect(disconnecteUserId){
  console.log("disconnecteUserId",disconnecteUserId)
  for (let user in socketlists) {
    console.log("disconeed!",socketlists)
    if(socketlists[user]==disconnecteUserId){

      if(user==workingLeader){
        voteCount=0; workingLeader=''; saveAgreeCount=1; votedUserList = {};
        saveConfirmCount =1;
      }
      delete socketlists[user];
      if(workingUserLists[user]) delete workingUserLists[user];
      socket.broadcast.emit(DISCONNECTED, user);
      totalUserCount --;
    }
}
console.log("socketlists",socketlists);
}
socket.on(LEADER_VOTE, (data) => {
  vote(data);
});


socket.on(DRAWINGDATA, function(data){
  historyData.push(data);
  console.log("DRAWINGDATA",data);
});



socket.on(HISTORY_CALL, (workinguser) => {
 history(workinguser);
   
});
socket.on(USER_JOIN, (workingUser) => {
  workingUserLists[workingUser]=workingUser;
  socket.broadcast.emit(USER_JOIN, workingUser);
   
});

//drawing part
//clear canvas
socket.on(CLEARCANVAS, function(DATA){
  historyData=[];
  socket.broadcast.emit(CLEARCANVAS, false);
  console.log('CLEARCANVAS',DATA);
});
   //canvas update
   socket.on(CANVAS_UPDATE, function(DATA){
    socket.broadcast.emit(CANVAS_UPDATE, DATA);
    console.log('CANVAS_UPDATE',DATA);
  });
   //text drawing
   socket.on(TEXTDRAWING, function(DATA){
    socket.broadcast.emit(TEXTDRAWING, DATA);
    console.log('TEXTDRAWING',DATA);
  });
   //line drawing 
   socket.on(LINEDRAWING, function(DATA){
    socket.broadcast.emit(LINEDRAWING, DATA);
    console.log('LINEDRAWING',DATA);
  });
  //ellipse drawing
  socket.on(EPSDRAWING, function(DATA){
    socket.broadcast.emit(EPSDRAWING, DATA);
    console.log("EPSDRAWING",DATA);
  });
  //circle drawing
   socket.on(CIRCLEDRAWING, function(DATA){
    socket.broadcast.emit(CIRCLEDRAWING, DATA);
    console.log("CIRCLEDRAWING",DATA);
  });
  
 
 //use pencil
  socket.on(PENDRAWING, function(DATA){
    socket.broadcast.emit(PENDRAWING, DATA);
    console.log(DATA);
  });
  
 
  //rectangle drawing
  socket.on(RECTDRAWING, function(DATA){
    socket.broadcast.emit(RECTDRAWING, DATA);
    console.log('RECTDRAWING',DATA);
  });

  socket.on(SAVE_CONFIRM, function(data){
    console.log("SAVE_CONFIRM");
    socket.broadcast.emit(SAVE_CONFIRM, data);
  });
  socket.on(SAVE_RESULT, function(data){
    console.log("SAVE_RESULT");
    save(data);
    
  });

 

});