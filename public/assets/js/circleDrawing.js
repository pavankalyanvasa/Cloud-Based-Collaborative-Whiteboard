function circleDrawing(x, y, w, h, colorVal, linewidth, emit){
    var kappa = .5522848;
    current2dWhiteBoardCanvas.clearRect(0, 0, currentWhiteBoard.width, currentWhiteBoard.height); 
  var ox, oy, xe, ye, xm, ym;
 
  xm = x + w / 2,       // x-middle
  ym = y + h / 2;       // y-middle
    ox = (w / 2) * kappa, // control point offset horizontal
    oy = (h / 2) * kappa, // control point offset vertical
    xe = x + w,           // x-end
    ye = y + h,           // y-end

    current2dWhiteBoardCanvas.beginPath();
    current2dWhiteBoardCanvas.moveTo(x, ym);
    current2dWhiteBoardCanvas.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    current2dWhiteBoardCanvas.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    current2dWhiteBoardCanvas.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    current2dWhiteBoardCanvas.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    current2dWhiteBoardCanvas.closePath();
  
      if(colorVal)
          current2dWhiteBoardCanvas.strokeStyle = "#"+colorVal;
      else
          current2dWhiteBoardCanvas.strokeStyle = "#"+currentSelectColorValue; 
      if(linewidth)
          current2dWhiteBoardCanvas.lineWidth = linewidth;
      else
          current2dWhiteBoardCanvas.lineWidth = currentSelectlineThicnessValue;  
          current2dWhiteBoardCanvas.stroke();
      
          
          if (!emit) { return; }
          socket.emit(CIRCLEDRAWING, {x: x, y: y,w: w, h: h, colorVal: currentSelectColorValue, lineThickness: currentSelectlineThicnessValue
          });
  
}

function onCircleDrawing(data){
    var width = currentWhiteBoardCanEle.width;
    var height = currentWhiteBoardCanEle.height;
    circleDrawing(data.x, data.y, data.w, data.h, data.colorVal, data.lineThickness);
}

 