'use strict'
console.log('Controller');

var gDrag = false
var gOnEdit = false;
var gElCanvas;
var gElContainer;
var gCtx;

function onInit() {
    gElCanvas = document.getElementById('my-canvas');
    gElContainer = document.querySelector('.canvas-container');
    gCtx = gElCanvas.getContext('2d');
    renderGallry();
    setKeywords();
    loadSavedMemsData();
}

function onSetMeme(id, type) {
    AddEventListeners();
    document.querySelector('.search-box').style.display = 'none';
    document.querySelector('.pics-gallery').style.display = 'none';
    document.querySelector('.meme-editor').style.display = 'grid';
    setMeme(id, type, gElCanvas.width, gElCanvas.height);
    resizeCanvas();
    matchToolsDisplayWithCurrLine()
};
function AddEventListeners() {
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    var elBtns = document.querySelectorAll('.sharing-opt')
    elBtns.forEach(btn => {
        btn.addEventListener('mouseover', () => {
            removeEditingHighlit();
        })
    })
}
function resizeCanvas() {
    gElCanvas.width = gElContainer.offsetWidth;
    gElCanvas.height = gElContainer.offsetHeight;
    calibrateMeme(gElCanvas.width, gElCanvas.height);
    renderMeme()
}

// EDIT MEME
function onEditCurrLine(type, content) {
    var meme = getMeme()
    meme.selectedLineIdx = (meme.selectedLineIdx === -1) ? 0 : meme.selectedLineIdx
    gOnEdit = true;
    editMemeLine(type, content);
    renderMeme();
    matchToolsDisplayWithCurrLine();
};
function onSwitchLine(idx) {
    switchLine(idx);
    renderMeme();
    matchToolsDisplayWithCurrLine()
}
// ADD / REMOVE
function onAddLine() {
    gOnEdit = true;
    newLine(gElCanvas.width, gElCanvas.height);
    renderMeme();
}
function onDeleteLine() {
    gOnEdit = true;
    deleteCurrLine();
    renderMeme();
}
// SAVING OPTIONS
function onDownloadMeme(elButton) {
    var data = gElCanvas.toDataURL();
    elButton.href = data;
    elButton.download = 'Meow-Meme';
}
function onSaveMeme() {
    var elBtn=document.querySelector(['.saved']);
    elBtn.classList.add('animate-pop')
    setTimeout(()=>elBtn.classList.remove('animate-pop'),1000)
    gOnEdit= false;
    var dataUrl = gElCanvas.toDataURL();
    createSavedMemesData(dataUrl);
}
function onFacebookShare(elForm, ev) {
    ev.preventDefault;
    uploadImg(elForm, ev, gElCanvas);
}
// RENDER MEME EDITOR
function renderMeme() {
    var meme = getMeme();
    if (!meme) return;
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
    text = (text === '') ? 'Your Joke' : text
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
    gCtx.fillRect(0, y - size, gElCanvas.width, size + 15);
};
function removeEditingHighlit() {
    var meme = getMeme();
    meme.selectedLineIdx = -1;
    renderMeme();
}
function matchToolsDisplayWithCurrLine() {
    var meme = getMeme()
    var currLine = (meme.selectedLineIdx !== -1) ? meme.selectedLineIdx : 1;
    document.querySelector('.txt-input').value = `${meme.lines[currLine].txt}`;
    document.querySelector('.font-choice').value = `${meme.lines[currLine].font}`;
    document.querySelector('.fill-choice').value = `${meme.lines[currLine].fill}`;
    document.querySelector('.stroke-choice').value = `${meme.lines[currLine].stroke}`;
}
// DRAG OBJECTS
function onMouseAboveObject(ev) {
    if (gDrag) return;
    var { offsetX, offsetY } = ev;
    var meme = getMeme();
    var objectIdx = meme.lines.findIndex(line => ((line.y - line.size) < offsetY && offsetY < line.y));
    if (objectIdx >= 0) document.body.style.cursor = 'grab';
    if (objectIdx < 0) document.body.style.cursor = 'default';
}
function onPickObject(ev) {
    gDrag = true;
    if (ev.type === 'touchstart') {
        ev.preventDefault();
        var offsetXY = recoverOffsetValues(ev);
        offsetX = offsetXY[0];
        offsetY = offsetXY[1];
    } else {
        var { offsetX, offsetY } = ev;
    }
    var meme = getMeme();
    var objectIdx = meme.lines.findIndex(line => ((line.y - line.size) < offsetY && offsetY < line.y));
    onSwitchLine(objectIdx);
}
function onDrag(ev) {
    var meme = getMeme();
    if (!gDrag) return;
    if (meme.selectedLineIdx < 0) return;
    gOnEdit = true;
    if (ev.type === 'touchmove' || ev.type === 'touchstart') {
        ev.preventDefault();
        var offsetXY = recoverOffsetValues(ev);
        offsetX = offsetXY[0];
        offsetY = offsetXY[1];
    } else {
        var { offsetX, offsetY } = ev;
    }
    var meme = getMeme()
    meme.lines[meme.selectedLineIdx].x = offsetX;
    meme.lines[meme.selectedLineIdx].y = offsetY;
    renderMeme();
}
function onDropObject() {
    gDrag = false;
    document.body.style.cursor = 'default';
}
function recoverOffsetValues(ev) {
    var rect = ev.target.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();
    var offsetX = ev.changedTouches[0].pageX - (rect.left - bodyRect.left);
    var offsetY = ev.changedTouches[0].pageY - (rect.top - bodyRect.top);
    return [offsetX, offsetY];
}

function onResizeObject(event) {
    var meme = getMeme();
    if (meme.selectedLineIdx<0) return
    if (event.deltaY<0)meme.lines[meme.selectedLineIdx].size-- 
    else if (event.deltaY>0) meme.lines[meme.selectedLineIdx].size++ 
    renderMeme();
}
