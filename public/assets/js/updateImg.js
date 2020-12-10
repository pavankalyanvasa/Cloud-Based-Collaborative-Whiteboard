function updateImg(trans) {
    currentCanvasCtxt.drawImage(currentWhiteBoard, 0, 0);
    current2dWhiteBoardCanvas.clearRect(0, 0, currentWhiteBoard.width, currentWhiteBoard.height);
    if (!trans) { return; }
      socket.emit(CANVAS_UPDATE, { transferCanvas: true
    });
}
function onCanvasUpdate(data){
  updateImg();
}
