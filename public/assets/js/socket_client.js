'use strict';

(function() {
    //var socket = io();
var minMember=2;
var leader= '';
var votedstatus = false;
var userCount = 1;
var userLists= [];
var totalCount=1;
var workingCount =0;
var workingUserLists = {};

if(window.addEventListener) {
window.addEventListener('load', function () {
    socket.emit(USER_CONNECTED, username);
    socket.on('connect', () => {
        console.log("Connected to server!--",username);
      });
      socket.on(USER_CONNECTED, (newUser) => {
        userCount+=1;totalCount+=1;
        userLists.push(newUser);
        var tx1= "<button id='" + newUser + "' class='userSelectButton' onclick='leaderVoting("+"this"+")'>" + newUser + "</button><br>" ;
        $("#userLists").append(tx1);
        $("#userLists").animate({ scrollTop: $("#userLists").height() }, "slow");
        descriptionChange();
        $("#Total").text(totalCount);
        console.log("leader",leader);
        if(leader&& leader!=username){

          //display leader to new user
           if(leader==newUser&& document.getElementById(leader)){
            document.getElementById(newUser).style.backgroundColor="rgb(255, 0, 0)";
            var tx1= "<button id='" + newUser + "1'  class='userSelectButton'>" + newUser + "</button><br>" ;
            $("#workingLists").append(tx1);
            $("#workingLists").animate({ scrollTop: $("#workingLists").height() }, "slow");
          }
          //display joined users to new user
           if(workingUserLists[newUser]){
             workingCount ++;
             $("#Working").text(workingCount);
             document.getElementById(newUser).style.background="rgb(51, 102, 255)";
             var tx1= "<button id='" + newUser + "1'  class='workingSelectButton'>" + newUser + "</button><br>" ;
              $("#workingLists").append(tx1);
              $("#workingLists").animate({ scrollTop: $("#workingLists").height() }, "slow");
            }
                 //disable new user if you are not leader.
                document.getElementById(newUser).disabled=true;
        }
         if (!leader && $("#desc").text()=="Voted"){
          document.getElementById(newUser).disabled=true;
         }
         if($("#desc").text()=="Observer"){

            document.getElementById(newUser).disabled=true;
         }
    
    });
    socket.on("LEADERNAME", (data) => {
        console.log("leadername____",data);
        leader=data;
        localStorage.setItem("leader",data);
        if($("#userName").text()!=leader) $("#desc").text("Observer")
       
    });
    socket.on('WORKINGUSERLIST', (data) => {
        workingUserLists=data;
        var work=Object.keys(data).length;
    $("#Working").text(work);

     }); 
     
     $("#json_upload").click(function(){
      console.log("json_upload----------");
      document.getElementById("json_upload_modal").click();
      
    });   
    $("#jsonUpload").click(function(){
      console.log("jsonSave----------");
      var uploadfilename = $("#uploadfilename").val();
      if(uploadfilename){
        socket.emit("JSONUPLOAD",uploadfilename);
      }
      
      $("#jsonUploadModal").hide()
      $(".modal-backdrop").remove()
    })
    
    $("#jsonUploadCancel").click(function(){
      console.log("jsonUploadCancel----------");
      var filename = $("#uploadfilename").val("");    
      $("#jsonUploadModal").hide()
      $(".modal-backdrop").remove()
    })
    
  $("#json_save").click(function(){
    console.log("json_save----------");
    document.getElementById("jsonSave_modal").click();
    
  });   
  
  $("#jsonSave").click(function(){
    console.log("jsonSave----------");
    var filename = $("#filename").val();
    if(filename){
      socket.emit("JSONSAVE",filename);
    }
    
    $("#jsonSaveModal").hide()
    $(".modal-backdrop").remove()
  })
  
  $("#jsonsaveCancel").click(function(){
    console.log("jsonSave----------");
    var filename = $("#filename").val("");    
    $("#jsonSaveModal").hide()
    $(".modal-backdrop").remove()
  })
  socket.on("JSONSAVE",(filename) =>{
    console.log("JSONSAVE----------");
    document.getElementById("json_save_confirm").click();
  })

  $("#jsonsaveYes").click(function(){
    console.log("jsonsaveYes----------");
    socket.emit("JSONSAVECONFIRM",true)
    
    $("#jsonSaveConfirmModal").hide()
    $(".modal-backdrop").remove()
  })
  $("#jsonsaveNo").click(function(){
    console.log("jsonsaveNo----------");
    socket.emit("JSONSAVECONFIRM",false)
    
    $("#jsonSaveConfirmModal").hide()
    $(".modal-backdrop").remove()
  })
  socket.on(SAVE_CONFIRM, (data) => {
    console.log('SaveConfirm-')
      var snackbarEle=document.getElementById("mysnackbar11").classList;                 
      console.log(snackbarEle);
      snackbarEle.add("show");
      setTimeout(function(){ snackbarEle.remove("show");}, 3000);
  document.getElementById("save_confirm").click();
});

socket.on(LEADER_VOTE, (data) => {
  
  console.log("LEADER_VOTE----------");
  if (data == $("#userName").text()) {
    localStorage.setItem("votedstatus",true)
    votedstatus=true;
  }
});



  
  

socket.on(SAVE_RESULT, (data) => {
  console.log("SAVE_RESULT",data)
  if(data){
    var mycanvas = document.getElementById("canvasDisplayWhiteboard");
    var img    = mycanvas.toDataURL("image/png");
    var downloadPngFile = document.createElement('a');
    downloadPngFile.href = img;
    downloadPngFile.download = "Canvas.png";
    document.body.appendChild(downloadPngFile);
    downloadPngFile.click();
  } else {
    document.getElementById('mysnackbar').innerText="You can't save file because some members don't agree to save!";
    var snackbarEle=document.getElementById("mysnackbar11").classList;                 
    console.log(snackbarEle);
    snackbarEle.add("show");
    setTimeout(function(){ snackbarEle.remove("show");}, 3000);

  }
 });



socket.on("ERROR", (data) => {
    console.log("ERROR----!");
    //
   })


socket.on(CLEARCANVAS, onCanvasClear);
socket.on(LINEDRAWING, onLineDrawing);
socket.on(RECTDRAWING, onRectDrawing);
socket.on(CANVAS_UPDATE, onCanvasUpdate);
socket.on(CIRCLEDRAWING, onCircleDrawing);

socket.on(PENDRAWING, onPenUsinDrawing);

socket.on("USER_DISCONNECTED", (disconnectedUser) => {
  console.log("disconnectedUser:",disconnectedUser)
  document.getElementById(disconnectedUser).nextSibling.remove();
  if(workingUserLists[disconnectedUser]){
    document.getElementById(disconnectedUser + "1").nextSibling.remove();
    document.getElementById(disconnectedUser+"1").remove();
  }
  document.getElementById(disconnectedUser).remove();
  userCount --;
  totalCount --;

  if(disconnectedUser==localStorage.getItem('leader')){
    localStorage.removeItem('leader');
    localStorage.removeItem('voted');
    $("#desc").text("Voting");
    $("#snackbar").text("Leader disconnected from server. Please vote to elect anoher leader!");
         $("#snackbar").addClass("show");      
         setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
    var elems = document.getElementsByClassName("userSelectButton");
    for(var i = 0; i < elems.length; i++) {
        elems[i].disabled = false;
        elems[i].style.backgroundColor="";
    }
   // startVoting=false;
   descriptionChange();
    
   // container.removeChild(mycanvas);
  }

 })

function descriptionChange(){
    console.log("desck_change")
    console.log("usrename---",username,"--joineduselist--",workingUserLists[username],"---votestatus--",votedstatus)
    var desc = '';
    if(userCount < minMember) {desc= "Waiting";
       $("#desc").text(desc);
        }
    if (userCount >= minMember && $("#desc").text()=="Waiting"){
      desc = "Voting";
      $("#desc").text(desc);
    }
   
  
  }

  
  function init () {

  }
  init();
  
    

}, false); }



//end


})();