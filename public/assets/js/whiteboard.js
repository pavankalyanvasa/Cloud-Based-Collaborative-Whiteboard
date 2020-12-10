'use strict';

(function() {
 
  var workingUserLists={};
  var socket = io();
  var username=localStorage.getItem("username");
  var userCount=1;
  var leader = "" ;
  var workingUserLists = {};
  var minMember=2;
  var startVoting = false;
  localStorage.setItem('startVoting',startVoting)
  


if(window.addEventListener) {
window.addEventListener('load', function () {
  
  var startingToolName = 'pencil';
  socket.on(WORKSTARTING, (leader1) => {
    console.log("leader:",leader1)
    localStorage.setItem('leader',leader1);
    leader=localStorage.getItem('leader');
    
    console.log("leader:",leader)
    if (username == leader1){
      document.getElementById('desc').innerHTML="Leader";
      
      $("#snackbar").text("You elected as leader in this whiteboard system!");
      $("#snackbar").addClass("show");      
      setTimeout(function(){ $("#snackbar").removeClass("show")}, 3000);
      document.getElementById('canvas_clear').disabled=false;
      document.getElementById('canvas_save').style.display="block";
      document.getElementById('json_save').style.display="block";
      document.getElementById('json_upload').style.display="block";
      var elems = document.getElementsByClassName("userSelectButton");
          for(var i = 0; i < elems.length; i++) {
              elems[i].disabled = false;
          }
      container.appendChild(currentWhiteBoard);
  
    } else{  

      if(!workingUserLists[username]){
        
      if( document.getElementById(leader1)){
      document.getElementById(leader1).style.backgroundColor="rgb(255, 0, 0)";}

      document.getElementById('desc').innerHTML="Observer";
      document.getElementById('mysnackbar').innerText=`The leader of this whiteboard System is ${leader1}` ;
      var snackbarEle=document.getElementById("mysnackbar11").classList;                 
      console.log(snackbarEle);
      snackbarEle.add("show");
       setTimeout(function(){ snackbarEle.remove("show");}, 3000);
    }}
   
  })
 
 
  socket.on('WORKINGUSERLIST', (data) => {
    console.log("WORKINGUSERLIST----------",data);
    var work=Object.keys(data).length;
    $("#Working").text(work);

 }); 


  socket.on(USER_JOIN, (workingUser) => {
    console.log("workingUser:",workingUser)
    if(document.getElementById(workingUser)){
       document.getElementById(workingUser).style.backgroundColor="	rgb(51, 102, 255)";
      }
    if(username==workingUser){
      console.log("username:",username,"-----workingUser:",workingUser);
      $("#desc").text("Working");
      document.getElementById('mysnackbar').innerText="You can work on this whiteboard !";
      var snackbarEle=document.getElementById("mysnackbar11").classList;                 
      console.log(snackbarEle);
      snackbarEle.add("show");
       setTimeout(function(){ snackbarEle.remove("show");}, 3000);
      container.appendChild(currentWhiteBoard);
      socket.emit(HISTORY_CALL,workingUser);
    }
   })
  
   function descriptionChange(){
    console.log("descdescriptionChange")
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
  
   
    //show the status of whiteboard
    descriptionChange();

    // Find the canvas element.
    currentWhiteBoardCanEle = document.getElementById('canvasDisplayWhiteboard');
    if (!currentWhiteBoardCanEle) {
      document.getElementById('mysnackbar').innerText="Error occure!"
      var snackbarEle=document.getElementById("mysnackbar11").classList;                 
      console.log(snackbarEle);
      snackbarEle.add("show");
       setTimeout(function(){ snackbarEle.remove("show");}, 3000);
      return;
    }
      
    if (!currentWhiteBoardCanEle.getContext) {
      document.getElementById('mysnackbar').innerText="Error occure!"
      var snackbarEle=document.getElementById("mysnackbar11").classList;                 
      console.log(snackbarEle);
      snackbarEle.add("show");
       setTimeout(function(){ snackbarEle.remove("show");}, 3000);
      return;
    }

   
    currentCanvasCtxt = currentWhiteBoardCanEle.getContext('2d');
    if (!currentCanvasCtxt) {
      document.getElementById('mysnackbar').innerText="Error occure!"
      var snackbarEle=document.getElementById("mysnackbar11").classList;                 
      console.log(snackbarEle);
      snackbarEle.add("show");
       setTimeout(function(){ snackbarEle.remove("show");}, 3000);
      return;
    }

    var container= currentWhiteBoardCanEle.parentNode;
    currentWhiteBoard = document.createElement('canvas');
    if (!currentWhiteBoard) {
      document.getElementById('mysnackbar').innerText="Canvas Element don't exist!"
      var snackbarEle=document.getElementById("mysnackbar11").classList;                 
      console.log(snackbarEle);
      snackbarEle.add("show");
       setTimeout(function(){ snackbarEle.remove("show");}, 3000);
     
      return;
    }

    currentWhiteBoard.id     = 'canvasTemp';
    currentWhiteBoard.width  = currentWhiteBoardCanEle.width;
    currentWhiteBoard.height = currentWhiteBoardCanEle.height;
    current2dWhiteBoardCanvas = currentWhiteBoard.getContext('2d');
  
    // Get the tool select input.
    var selectTool = document.getElementById('pencelTool');   
    //Choose line Width
    currentSelectlineThicnessValue = $("#thicknessChangeTool").val();
        
    $("#thicknessChangeTool").change(function(){
        currentSelectlineThicnessValue = $("#thicknessChangeTool").val();
    });
     //currentSelectfontsizeValue
     currentSelectfontsizeValue = $("#txtSizeTool").val();
    
     $("#txtSizeTool").change(function(){
         currentSelectfontsizeValue = $("#txtSizeTool").val();
     })

     //Choose colour picker
currentSelectColorValue = $("#changeColor").val();
    
    $("#changeColor").change(function(){
        currentSelectColorValue = $("#changeColor").val();
    });
    //currentSelectfontfamValue
    currentSelectfontfamValue = $("#txtFamilyTool").val();
    
    $("#txtFamilyTool").change(function(){
        currentSelectfontfamValue = $("#txtFamilyTool").val();
    })
    

    // Activate the default tool.
    if (whiteboarddrawingTools[startingToolName]) {
      currentSelTool = new whiteboarddrawingTools[startingToolName]();
      selectTool.value = startingToolName;
    }

    currentWhiteBoard.addEventListener('mouseup',   eventCanvas, false);
    currentWhiteBoard.addEventListener('mousedown', eventCanvas, false);
    currentWhiteBoard.addEventListener('mousemove', numEventPerSec(eventCanvas, 12), false);
  
  }

  function eventCanvas (event) {
      var CanvasPosition = currentWhiteBoard.getBoundingClientRect(); 
    if (event.clientX || v.clientX == 0) { 
      event._x = event.clientX - CanvasPosition.left;
      event._y = event.clientY - CanvasPosition.top;
    } else if (event.offsetX || ev.offsetX == 0) { 
    }
    var func = currentSelTool[event.type];
    if (func) {
      func(event);
    }
    
  }
    
  function numEventPerSec(callback, delay) {
    var pastCall,time;
     pastCall = new Date().getTime();
    return function() {
      time = new Date().getTime();

      if ((time - pastCall) >= delay) {
        pastCall = time;
        callback.apply(null, arguments);
      }
    };
  }
     function onCanvasUpdate(data){
            updateImg();
    }
 
  whiteboarddrawingTools.circle = function () {
    var currentSelTool = this;
    this.started = false;
    whiteboardTextareadrawingTool.style.display = "none";
    whiteboardTextareadrawingTool.style.value = "";
    var x,y,w,h;
    this.mouseup = function (e) {
      if (currentSelTool.started) {
        currentSelTool.mousemove(e);
        currentSelTool.started = false;
        updateImg(true);

        let data = { x: x, y: y, w: w,h: h,colorVal: currentSelectColorValue,lineThickness: currentSelectlineThicnessValue}
      
        let type = CIRCLEDRAWING;
        let drawingData={};
        drawingData[type]=data;
         socket.emit(DRAWINGDATA, drawingData);
      }
    };
    this.mousedown = function (e) {
      currentSelTool.started = true;
        currentSelTool.x0 = e._x;
      currentSelTool.y0 = e._y;
    };


    this.mousemove = function (e) {
      if (!currentSelTool.started) {
        return;
      }
      
         x = Math.min(e._x, currentSelTool.x0);
		 y = Math.min(e._y, currentSelTool.y0);
		
		 w = Math.abs(e._x - currentSelTool.x0);
		 h = Math.abs(e._y - currentSelTool.y0);
      
        current2dWhiteBoardCanvas.clearRect(0, 0, currentWhiteBoard.width, currentWhiteBoard.height); 
        circleDrawing(x, y, w, h, currentSelectColorValue, currentSelectlineThicnessValue, true);

    };
    
  };
  
  // The rectangle tool.
  whiteboarddrawingTools.rect = function (){
    var currentSelTool = this;
    var pos_x, pos_y,pos_w, pos_h
    this.started = false;
    whiteboardTextareadrawingTool.style.display = "none";
    whiteboardTextareadrawingTool.style.value = "";
   
   //above the tool function

    this.mousedown = function (ev) {
      currentSelTool.started = true;
      currentSelTool.x0 = ev._x;
      currentSelTool.y0 = ev._y;
    };

    this.mousemove = function (e) {
      if (!currentSelTool.started) {
        return;
      }

          pos_x = Math.min(e._x,  currentSelTool.x0),
          pos_w = Math.abs(e._x - currentSelTool.x0),
          pos_y = Math.min(e._y,  currentSelTool.y0),         
          pos_h = Math.abs(e._y - currentSelTool.y0);

      current2dWhiteBoardCanvas.clearRect(0, 0, currentWhiteBoard.width, currentWhiteBoard.height); //in rectDrawing

      if (!pos_w || !pos_h) {
        return;
      }
        //console.log("emitting")
      rectDrawing(pos_x, pos_y, pos_w, pos_h, currentSelectColorValue, currentSelectlineThicnessValue, true);
      //current2dWhiteBoardCanvas.strokeRect(x, y, w, h); // in rectDrawing
    };

    this.mouseup = function (ev) {
      if (currentSelTool.started) {
        currentSelTool.mousemove(ev);
        currentSelTool.started = false;
        updateImg(true);
        console.log("onDrawRect_mouseUp-----");
        var w = currentWhiteBoardCanEle.width;
        var h = currentWhiteBoardCanEle.height;
        //let data = {"type":"rectangle","data":{pos_x, pos_y, pos_w, pos_h, currentSelectColorValue, currentSelectlineThicnessValue}}
        let data = { min_x: pos_x / w, min_y: pos_y / h, abs_x: pos_w / w,abs_y: pos_h / h,colorVal: currentSelectColorValue,lineThickness: currentSelectlineThicnessValue}
        console.log("onDrawRect_mouseUp-----",data)
        let type = RECTDRAWING;
        let drawingData={};
        drawingData[type]=data;
         socket.emit(DRAWINGDATA, drawingData);
      }
    };
  }
 
  // The line drawing tool.
  whiteboarddrawingTools.line = function () {
    var currentSelTool = this;
    console.log("this---------",this)
    var x1,y1; this.started = false;
    whiteboardTextareadrawingTool.style.display = "none";
    whiteboardTextareadrawingTool.style.value = "";
  
    this.mousedown = function (ev) {
      currentSelTool.started = true;
      currentSelTool.x0 = ev._x; currentSelTool.y0 = ev._y;
      x1=ev._x; y1=ev._y;
    };

  
    this.mouseup = function (e) {
      if (currentSelTool.started) {
        currentSelTool.mousemove(e);
        currentSelTool.started = false;
        updateImg(true);
        var w = currentWhiteBoardCanEle.width;
        var h = currentWhiteBoardCanEle.height;
        let data = { posXstart: x1/w, posYstart: y1/h, posXend: e._x/w,posYend: e._y/h,colorVal: currentSelectColorValue,lineThickness: currentSelectlineThicnessValue}
        socket.emit(LINEDRAWING, {posXstart: posXstart / whiteboardWidth,posYstart: posYstart / whiteboardHeight, posXend: posXend / whiteboardWidth,posYend: posYend / whiteboardHeight,colorValue: currentSelectColorValue,lineThickness: currentSelectlineThicnessValue
        });
        console.log("linedraw_mouseUp-----",data)
        let type = LINEDRAWING;
        let drawingData={};
         drawingData[type]=data;
         socket.emit(DRAWINGDATA, drawingData);
        
      }
    };
    this.mousemove = function (e) {
      if (!currentSelTool.started) {
        return;
      }
        lineDrawing(currentSelTool.x0, currentSelTool.y0, e._x, e._y, currentSelectColorValue, currentSelectlineThicnessValue, true);

    };

    
  };

whiteboarddrawingTools.pencil = function () {
var currentSelTool = this;
whiteboardTextareadrawingTool.style.value = "";
whiteboardTextareadrawingTool.style.display = "none";
this.started = false;

// This is called when you release the mouse button.
this.mouseup = function (ev) {
  if (currentSelTool.started) {
    currentSelTool.mousemove(ev);
    currentSelTool.started = false;
    updateImg(true);
  }
};
// starting the pencil drawing.
this.mousedown = function (e) {
    currentSelTool.started = true; 
    currentSelTool.y0 = e._y;
    currentSelTool.x0 = e._x;
  
};


this.mousemove = function (ev) {
  if (currentSelTool.started) {
    penUsinDrawing(currentSelTool.x0, currentSelTool.y0, ev._x, ev._y, currentSelectColorValue, currentSelectlineThicnessValue, true);
    console.log(" onPenUsinDrawing__mouseUp-----");
    var w = currentWhiteBoardCanEle.width;
    var h = currentWhiteBoardCanEle.height;
    //let data = {"type":"rectangle","data":{pos_x, pos_y, pos_w, pos_h, currentSelectColorValue, currentSelectlineThicnessValue}}
    let data = { posXstart: currentSelTool.x0 / w, posYstart:currentSelTool.y0 / h,  posXend:ev._x/ w,posYend: ev._y / h,colorValue: currentSelectColorValue,lineThickness: currentSelectlineThicnessValue}
    console.log(" onPenUsinDrawing_mouseUp-----",data)
    let type = PENDRAWING;
    let drawingData={};
    drawingData[type]=data;
     socket.emit(DRAWINGDATA, drawingData);
    currentSelTool.x0 = ev._x;
    currentSelTool.y0 = ev._y;

  }
};
};

 //Text Tool start
 function textDrawing(fsize, ffamily, colorValue, textPosLeft, textPosTop, processed_lines, emit){
  console.log("textDrawingtextDrawingtextDrawing")
  current2dWhiteBoardCanvas.textBaseline = 'top';
  current2dWhiteBoardCanvas.fillStyle = "#"+colorValue;
 current2dWhiteBoardCanvas.font = fsize + ' ' + ffamily;
 
 
  
 for (var n = 0; n < processed_lines.length; n++) {
     var processed_line = processed_lines[n];
      
     current2dWhiteBoardCanvas.fillText(
         processed_line,  parseInt(textPosLeft),parseInt(textPosTop) + n*parseInt(fsize)
     );
 }
 
 updateImg(); 
 
 if (!emit) { return; }
     socket.emit(TEXTDRAWING, {
       fsize: fsize, ffamily: ffamily, colorVal: colorValue, textPosLeft: textPosLeft,
       textPosTop: textPosTop, processed_linesArray: processed_lines 
     });

}
function onTextDrawing(data){
  console.log("onTextDrawing");
  var w = currentWhiteBoardCanEle.width;
  var h = currentWhiteBoardCanEle.height;
  textDrawing(data.fsize, data.ffamily, data.colorVal, data.textPosLeft, data.textPosTop, data.processed_linesArray);
}
 var tempText = document.createElement('div');
 tempText.style.display = 'none';

 whiteboarddrawingTools.text = function () {
     var currentSelTool = this;
     this.started = false;
     whiteboardTextareadrawingTool.style.display = "none";
     whiteboardTextareadrawingTool.style.value = "";
     this.mouseup = function (e) {
       if (currentSelTool.started) {
           
             //start      
             var lines = whiteboardTextareadrawingTool.value.split('\n');
             var processed_lines = [];
             var left,top;
             for (var i = 0; i < lines.length; i++) {
                 var chars = lines[i].length;
          
                     for (var j = 0; j < chars; j++) {
                         var text_node = document.createTextNode(lines[i][j]);
                         tempText.appendChild(text_node);
                          
                         tempText.style.position   = 'absolute';
                         tempText.style.visibility = 'hidden';
                         tempText.style.display    = 'block';
                          
                         var width = tempText.offsetWidth;
                         var height = tempText.offsetHeight;
                         tempText.style.visibility = '';
                         tempText.style.position   = '';
                       
                         tempText.style.display    = 'none';
                         if (width > parseInt(whiteboardTextareadrawingTool.style.width)) {
                             break;
                         }
                     }
                  
                 processed_lines.push(tempText.textContent);
                 tempText.innerHTML = '';
             }
             var ff = currentSelectfontfamValue;
             var fs = currentSelectfontsizeValue + "px";
            
             
             textDrawing(fs, ff, currentSelectColorValue, whiteboardTextareadrawingTool.style.left, whiteboardTextareadrawingTool.style.top, processed_lines, true)
             top= whiteboardTextareadrawingTool.style.top;
             left=  whiteboardTextareadrawingTool.style.left;
             console.log("textDrawing")
             whiteboardTextareadrawingTool.style.display = 'none';
             whiteboardTextareadrawingTool.value = '';
                       
         //end
                   
         currentSelTool.mousemove(e);
         currentSelTool.started = false;
         let data = { fsize: fs, ffamily: ff, colorVal: currentSelectColorValue,textPosLeft: left,textPosTop: top,processed_linesArray: processed_lines}
         console.log("TEXTDRAWING_mouseUp-----",data)
         let type = TEXTDRAWING;
         let drawingData={};
         drawingData[type]=data;
          socket.emit(DRAWINGDATA, drawingData);
       }
 };
     this.mousedown = function (e) {
       currentSelTool.started = true;
       currentSelTool.y0 = e._y;
       currentSelTool.x0 = e._x;
 
     
     };
 
     this.mousemove = function (e) {
         if (!currentSelTool.started) {
         return;
       }
         
         var x = Math.min(e._x, currentSelTool.x0);
         var y = Math.min(e._y, currentSelTool.y0);
         var width = Math.abs(e._x - currentSelTool.x0);
         var height = Math.abs(e._y - currentSelTool.y0);
         whiteboardTextareadrawingTool.style.width = width + 'px';
         whiteboardTextareadrawingTool.style.top = y + 'px';
         whiteboardTextareadrawingTool.style.left = x + 'px';
         whiteboardTextareadrawingTool.style.height = height + 'px';
         whiteboardTextareadrawingTool.style.display = 'block';
         whiteboardTextareadrawingTool.style.color = "#"+currentSelectColorValue;
         whiteboardTextareadrawingTool.style.font = currentSelectfontsizeValue+'px' + ' ' + currentSelectfontfamValue;
     };
    
   };

   socket.on(TEXTDRAWING, onTextDrawing);

  init();
  
}, false); }

})();


