'use strict'
console.log('Controller');

var gOnEdit;
var gElCanvas;
var gCtx;

function onInit() {
    gOnEdit = false;
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderGallry();
    resizeCanvas();
}
function resizeCanvas() {
    if (gOnEdit) return
    var elContainer = document.querySelector('.canvas-container');
    console.log('elContainer.offsetWidth:', elContainer.offsetWidth)
    console.log('elContainer.offsetHeight:', elContainer.offsetHeight)
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
    var meme = getMeme()
    if (meme) { setMeme(meme.selectedImgId, gElCanvas.width, gElCanvas.height); renderMeme(); }
}
window.addEventListener('resize', function (event) {
    resizeCanvas();
});


function onSetMeme(imgId) {
    document.querySelector('.pics-gallery').style.display = 'none';
    document.querySelector('.meme-editor').style.display = 'grid';
    setMeme(imgId, gElCanvas.width, gElCanvas.height);
    resizeCanvas()
};
function onChangeCurrLine(type, content) {
    gOnEdit = true
    changeMemeLine(type, content);
    renderMeme();
};


// RENDER GALLERY
function renderGallry() {
    var imgs = getImages()
    document.querySelector('.pics-gallery').innerHTML = imgs.map(img => `<div style="background-image: url(${img.url})" onclick="onSetMeme(this.dataset.id)" data-id="${img.id}"></div>`).join('\n')
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
function renderMeme() {
    var meme = getMeme()
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
