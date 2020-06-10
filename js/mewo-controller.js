'use strict'
console.log('Controller');

var gElCanvas;
var gCtx;

function onInit() {
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
    resizeCanvas();
    // drawImg();
    var meme = getMeme()
    renderMeme(meme)
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

function onSetMeme(imgId){
    setMeme(imgId)
    var meme = getMeme()
    renderMeme(meme)
}

function drawText(text, x, y, size,align, fill, stroke, strokeWidth) {
    gCtx.font = `${size}px impact`;
    gCtx.textAlign = `${align}`;
    gCtx.fillStyle = `${fill}`;
    gCtx.strokeStyle = `${stroke}`;
    gCtx.lineWidth = `${strokeWidth}`;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}

function renderMeme(meme){
    var elImg = new Image();
    elImg.src = `./img/${meme.selectedImgId}.jpg`;
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
        for (var i= 0; i < meme.lines.length; i++){
            console.log('idov');
            var currLine = meme.lines[i]
            console.log('currLine.x:', currLine.x)
            drawText(currLine.txt,currLine.x,currLine.y,currLine.size,currLine.align,currLine.fill,currLine.stroke)
        }
    }
}
