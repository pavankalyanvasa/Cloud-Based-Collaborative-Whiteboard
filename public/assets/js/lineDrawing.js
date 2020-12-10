 //Lines drawing
 function lineDrawing(posXstart, posYstart, posXend, posYend, colorValue, linewidth, socketEmitstatus){
    current2dWhiteBoardCanvas.clearRect(0, 0, currentWhiteBoard.width, currentWhiteBoard.height); 
    current2dWhiteBoardCanvas.beginPath();
    current2dWhiteBoardCanvas.moveTo(posXstart, posYstart);
    current2dWhiteBoardCanvas.lineTo(posXend, posYend);
    if(colorValue){
      current2dWhiteBoardCanvas.strokeStyle = "#"+colorValue;
      console.log("lineDrawingColor:",colorValue);}
  else
    {  current2dWhiteBoardCanvas.strokeStyle = "#"+currentSelectColorValue; }
   if(linewidth){
      current2dWhiteBoardCanvas.lineWidth = linewidth;
      console.log("lineDrawingthickness:",linewidth);}
  else
      current2dWhiteBoardCanvas.lineWidth = currentSelectlineThicnessValue;
    current2dWhiteBoardCanvas.stroke();
    current2dWhiteBoardCanvas.closePath(); 
      if (!socketEmitstatus) { return; }
      console.log("socketEmitstatus:",socketEmitstatus);
      var whiteboardWidth = currentWhiteBoardCanEle.width;
      var whiteboardHeight = currentWhiteBoardCanEle.height;
      console.log("width-height",whiteboardWidth,"--",whiteboardHeight)
      socket.emit(LINEDRAWING, {posXstart: posXstart / whiteboardWidth,posYstart: posYstart / whiteboardHeight, posXend: posXend / whiteboardWidth,posYend: posYend / whiteboardHeight,colorValue: currentSelectColorValue,lineThickness: currentSelectlineThicnessValue
      });
  
}

function onLineDrawing(lineDrawingData){
  var whiteboardWidth = currentWhiteBoardCanEle.width;
  var whiteboardHeight = currentWhiteBoardCanEle.height;
  lineDrawing(lineDrawingData.posXstart * whiteboardWidth, lineDrawingData.posYstart * whiteboardHeight, lineDrawingData.posXend * whiteboardWidth, lineDrawingData.posYend * whiteboardHeight, lineDrawingData.colorValue, lineDrawingData.lineThickness);
}