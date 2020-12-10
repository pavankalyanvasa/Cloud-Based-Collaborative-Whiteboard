// The drawing pencil.
function penUsinDrawing(posXstart, posYstart, posXend, posYend, colorValue, linewidth, socketEmit){
    current2dWhiteBoardCanvas.beginPath();
    current2dWhiteBoardCanvas.moveTo(posXstart, posYstart);
    current2dWhiteBoardCanvas.lineTo(posXend, posYend);
    if(linewidth){
            console.log("penUsingDrawingthickness:",linewidth);
    current2dWhiteBoardCanvas.lineWidth = linewidth;}
    else
    current2dWhiteBoardCanvas.lineWidth = currentSelectlineThicnessValue;
    if(colorValue){
    console.log("penUsingDrawingColor:",colorValue);
        current2dWhiteBoardCanvas.strokeStyle = "#"+colorValue;}
    else
        current2dWhiteBoardCanvas.strokeStyle = "#"+currentSelectColorValue; 
    
    current2dWhiteBoardCanvas.stroke();
    current2dWhiteBoardCanvas.closePath();

    if (!socketEmit) { return; }
    var whiteboardWidth = currentWhiteBoardCanEle.width;
    var whiteboardHeight = currentWhiteBoardCanEle.height;

    socket.emit(PENDRAWING, {posXstart: posXstart / whiteboardWidth,posYstart: posYstart / whiteboardHeight,posXend: posXend / whiteboardWidth,posYend: posYend / whiteboardHeight, colorValue: currentSelectColorValue, lineThickness: currentSelectlineThicnessValue});
}

  
//Pen Drawing
function onPenUsinDrawing(pedDrawingData){
    var width = currentWhiteBoardCanEle.width;
    var height = currentWhiteBoardCanEle.height;
    penUsinDrawing(pedDrawingData.posXstart * width, pedDrawingData.posYstart * height, pedDrawingData.posXend * width, pedDrawingData.posYend * height, pedDrawingData.colorValue, pedDrawingData.lineThickness);
}