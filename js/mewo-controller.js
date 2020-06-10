'use strict'
console.log('Controller');

var gOnEdit;
var gElCanvas;
var gCtx;

function onInit() {
    gOnEdit = false;
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
    resizeCanvas();

    renderGallry()

    setMeme(4, gElCanvas.width, gElCanvas.height);
    var meme = getMeme();
    renderMeme(meme);
}
function resizeCanvas() {
    if (gOnEdit) return
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}
window.addEventListener('resize', function (event) {
    resizeCanvas();
});


function onSetMeme(imgId) {
    setMeme(imgId, gElCanvas.width, gElCanvas.height);
    var meme = getMeme();
    renderMeme(meme);
};
function onChangeCurrLine(type, content) {
    changeMemeLine(type, content);
    var meme = getMeme();
    renderMeme(meme);
};


// RENDER GALLERY
function renderGallry(){
    var imgs = getImages()
    var strHTML = imgs.map(img => `<div style="background-image: url(${img.url})" onclick="onSetMeme(this.dataset.id)" data-id="${img.id}"></div>`).join('\n')
    document.querySelector('.pics-gallery').innerHTML = strHTML
}

// RENDER MEME EDITOR
function addText(text, x, y, size, align, fill, stroke, strokeWidth) {
    gCtx.font = `${size}px impact`;
    gCtx.textAlign = `${align}`;
    gCtx.fillStyle = `${fill}`;
    gCtx.strokeStyle = `${stroke}`;
    gCtx.lineWidth = `${strokeWidth}`;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
};
function hilightEdit(x, y, size) {
    gCtx.beginPath();
    gCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    gCtx.fillRect(0, y - size, gElCanvas.width, size + 20);
};
function renderMeme(meme) {
    var elImg = new Image();
    elImg.src = `./img/${meme.selectedImgId}.jpg`;
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
        for (var i = 0; i < meme.lines.length; i++) {
            var currLine = meme.lines[i];
            hilightEdit(currLine.x, currLine.y, currLine.size);
            addText(currLine.txt, currLine.x, currLine.y, currLine.size, currLine.align, currLine.fill, currLine.stroke);
        };
    };
};
