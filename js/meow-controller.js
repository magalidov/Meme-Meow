'use strict'
console.log('Controller');

var gOnEdit;
var gElCanvas;
var gCtx;

function onInit() {
    gOnEdit = false;
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderGallry('new');
    resizeCanvas();
}
function resizeCanvas() {
    if (gOnEdit) return
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
    var meme = getMeme()
    if (meme){
        setMeme(meme.selectedImgId, gElCanvas.width, gElCanvas.height);
        renderMeme();
    }
    // if (gOnEdit) {
    //     for (var i = 0; i< meme.lines.length; i++){
    //         editMemeLine('x', meme.lines[i].x-1,i)
    //         editMemeLine('y', meme.lines[i].y-1,i)
    //         renderMeme();
    //     }
    // } else if (meme){
    //     setMeme(meme.selectedImgId, gElCanvas.width, gElCanvas.height);
    //     renderMeme();
    // }
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

// SAVING OPTIONS
function onSaveMeme() {                       //NEEDS A FIX
    const data = gElCanvas.toDataURL();
    var meme = getMeme()
    meme.url = data
    saveToStorage('meows', meme)
}
function onDownloadMeme(elButton) {
    const data = gElCanvas.toDataURL();
    elButton.href = data;
    elButton.download = 'my_img';
}
function onFacebookShare(elButton) {
    const data = gElCanvas.toDataURL();
    elButton.href = `https://www.facebook.com/sharer/sharer.php?u=http://${data}`
}

// EDIT MEME
function onEditCurrLine(type, content) {
    gOnEdit = true
    editMemeLine(type, content);
    renderMeme();
};
function onSwitchLine() {
    switchLine()
    renderMeme()
}
// ADD REMOVE
function onAddLine() {
    newLine(gElCanvas.width, gElCanvas.height)
    renderMeme()
}
function onDeleteLine() {
    deleteCurrLine()
    renderMeme()
}

// RENDER GALLERY
function onShowGallery(gallery) {
    if (gOnEdit) { if (!confirm('Unsaved work will be lost')) return }
    renderGallry(gallery)
    document.querySelector('.pics-gallery').style.display = 'grid';
    document.querySelector('.meme-editor').style.display = 'none';
};
function renderGallry(gallery) {
    var imgs = (gallery === 'new') ? getImages() : [loadFromStorage('meows')]
    document.querySelector('.pics-gallery').innerHTML = imgs.map(img => `<div style="background-image: url(${img.url})" onclick="onSetMeme(this.dataset.id)" data-id="${img.id}"></div>`).join('\n')
}

// RENDER MEME EDITOR
function renderMeme() {
    var meme = getMeme()
    var elImg = new Image();
    elImg.src = `./${meme.selectedImgUrl}`;
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
        for (var i = 0; i < meme.lines.length; i++) {
            var currLine = meme.lines[i];
            if (meme.selectedLineIdx === i) hilightEdit(currLine.x, currLine.y, currLine.size);
            addText(currLine.txt, currLine.x, currLine.y, currLine.size, currLine.font, currLine.align, currLine.fill, currLine.stroke, currLine.strokeWidth);
        };
    };
};
function addText(text, x, y, size, font, align, fill, stroke, strokeWidth) {
    gCtx.font = `${size}px ${font}`;
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