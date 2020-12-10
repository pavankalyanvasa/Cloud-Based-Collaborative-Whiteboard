function rectDrawing(min_x, min_y, abs_x, abs_y, colorVal, linewidth, emit){
          
    current2dWhiteBoardCanvas.clearRect(0, 0, currentWhiteBoard.width, currentWhiteBoard.height); 
if(colorVal)
    current2dWhiteBoardCanvas.strokeStyle = "#"+colorVal;
else
    current2dWhiteBoardCanvas.strokeStyle = "#"+currentSelectColorValue; 
if(linewidth)
    current2dWhiteBoardCanvas.lineWidth = linewidth;
else
    current2dWhiteBoardCanvas.lineWidth = currentSelectlineThicnessValue;
    current2dWhiteBoardCanvas.strokeRect(min_x, min_y, abs_x, abs_y);
    
    if (!emit) { return; }
    var width = currentWhiteBoardCanEle.width;
    var height = currentWhiteBoardCanEle.height;

    socket.emit(RECTDRAWING, {min_x: min_x / width, min_y: min_y / height, abs_x: abs_x / width, abs_y: abs_y / height,colorVal: currentSelectColorValue,lineThickness: currentSelectlineThicnessValue
    });

}

function onRectDrawing(data){
    var w = currentWhiteBoardCanEle.width;
    var h = currentWhiteBoardCanEle.height;
    rectDrawing(data.min_x * w, data.min_y * h, data.abs_x * w, data.abs_y * h, data.colorVal, data.lineThickness);
}  