function rectDrawingfunction(current2dWhiteBoardCanvas,currentWhiteBoard,currentWhiteBoardCanEle,aa) {
  console.log("gjiegirjgiojeriosdgsgjgioe---------",aa)
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
  };