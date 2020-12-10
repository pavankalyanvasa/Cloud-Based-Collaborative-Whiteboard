function clickedTool(selected){
    if (whiteboarddrawingTools[selected.value]) {
      currentSelTool = new whiteboarddrawingTools[selected.value]();
    }
}
   
 $("#lineTool").click(function(){
    clickedTool(this)
});

 $("#circleTool").click(function(){
    clickedTool(this)
});
   $("#pencelTool").click(function(){
  clickedTool(this)
});
$("#textTool").click(function(){
    console.log("tedxt tooll clicke")
  clickedTool(this)
});
 $("#rectangleTool").click(function(){
  clickedTool(this)
})


  //canvas clear start
  $("#canvas_clear").click(function(){

    var currentWhiteBoard_w = currentWhiteBoard.width;
    var currentWhiteBoard_h = currentWhiteBoard.height;
    var currentWhiteBoardCanEle_w = currentWhiteBoardCanEle.width;
    var currentWhiteBoardCanEle_h = currentWhiteBoardCanEle.height;
        current2dWhiteBoardCanvas.clearRect(0, 0, currentWhiteBoard_w, currentWhiteBoard_h);
        currentCanvasCtxt.clearRect(0, 0, currentWhiteBoardCanEle_w, currentWhiteBoardCanEle_h);
        canvasClear(true)
    });
    function canvasClear(trans) {
      var currentWhiteBoard_w = currentWhiteBoard.width;
      var currentWhiteBoard_h = currentWhiteBoard.height;
      var currentWhiteBoardCanEle_w = currentWhiteBoardCanEle.width;
      var currentWhiteBoardCanEle_h = currentWhiteBoardCanEle.height;
      current2dWhiteBoardCanvas.clearRect(0, 0, currentWhiteBoard_w, currentWhiteBoard_h);
      currentCanvasCtxt.clearRect(0, 0, currentWhiteBoardCanEle_w, currentWhiteBoardCanEle_h);
      console.log("CLEARCANVAS")
          if (!trans) { return; }
  
          socket.emit(CLEARCANVAS, {
            CleardrawingBoard: true
          });
    }
    
     function onCanvasClear(data){
              canvasClear();
              console.log("CLEARCANVAS")
      }
      $("#canvas_save").click(function(){
         console.log("canvas_save")

            socket.emit("SAVE_CONFIRM", username);
         
      });
      $("#saveYes").click(function(){
        console.log("saveYes")
        $("#SaveConfirmModal").hide()
        $(".modal-backdrop").remove()
        
        socket.emit(SAVE_RESULT, true);
        
      });    
      $("#saveNo").click(function(){
        console.log("saveNo")
        socket.emit(SAVE_RESULT, false);
        $("#SaveConfirmModal").hide()
        $(".modal-backdrop").remove()
        
      });   
