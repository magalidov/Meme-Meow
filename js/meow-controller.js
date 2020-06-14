'use strict'
console.log('Controller');

var gDrag = false
var gOnEdit = false;
var gElCanvas;
var gCtx;

window.addEventListener('resize', function (event) {
    resizeCanvas();
});
function onInit() {
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderGallry();
    setKeywords();
    resizeCanvas();
    loadSavedMemsData();
}
function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
    var meme = getMeme();
    if (meme) {
        var id = (meme.type === 'item') ? meme.selectedImgId : meme.id;
        setMeme(id, meme.type, gElCanvas.width, gElCanvas.height);
        // calibrateMeme(gElCanvas.width, gElCanvas.height)
        renderMeme();
    }
}
function onSetMeme(id, type) {
    document.querySelector('.search-box').style.display = 'none';
    document.querySelector('.pics-gallery').style.display = 'none';
    document.querySelector('.meme-editor').style.display = 'grid';
    setMeme(id, type, gElCanvas.width, gElCanvas.height);
    resizeCanvas();
    matchToolsDisplayWithCurrLine()
};


// SAVING OPTIONS
function onDownloadMeme(elButton) {
    var meme = getMeme();
    meme.selectedLineIdx = -1;
    renderMeme();
    var data = gElCanvas.toDataURL();
    elButton.href = data;
    elButton.download = 'Meow-Meme';
}
function onSaveMeme() {                       
    var dataUrl = gElCanvas.toDataURL();
    createSavedMemesData(dataUrl);
}
function onFacebookShare(elForm, ev) {
    ev.preventDefault;
    uploadImg(elForm, ev, gElCanvas);
}
// EDIT MEME
function onEditCurrLine(type, content) {
    gOnEdit = true;
    editMemeLine(type, content);
    renderMeme();
    matchToolsDisplayWithCurrLine();
};
function onSwitchLine() {
    switchLine();
    renderMeme();
    matchToolsDisplayWithCurrLine()
}
// ADD REMOVE
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
// ON SEARCH TYPE
function onStartSearch(key, inputType = '') {
    key = key.toLowerCase();
    onShowGallery();
    var filterdImgs = filterGallery(key);
    renderGallry(filterdImgs);
    if (updateKeywords(key)) renderSearchBox(key, inputType);
}
// RENDER SEARCH BOX
function onToggleSearchBox() {
    var elBoxStyle = document.querySelector('.search-box').style;
    elBoxStyle.display = (!elBoxStyle.display || elBoxStyle.display === 'none') ? 'flex' : 'none';
    renderSearchBox();
}
function renderSearchBox(savedKey = '', inputType = '') {
    savedKey = (inputType !== 'keypress') ? savedKey : '';
    var keys = getSearchKeys();
    var keysHTML = '';
    for (var key in keys) {
        if (keys[key] > 3) {
            keysHTML += `<a onclick="onStartSearch('${key}','keypress')" style="color:rgba(1${10 - keys[key]}0, 1${10 - keys[key]}0, 1${10 - keys[key]}0); font-size:${keys[key] * 0.20}rem" class="key-word">${key}</a>`
        }
    }
    var strHTML = `
    <input oninput="onStartSearch(this.value)" class="search-input" data-type="txt" placeholder="Search" type="text" value="${savedKey}" autofocus>
    ${keysHTML}`;
    document.querySelector('.search-box').innerHTML = strHTML;
}
// RENDER GALLERY
function onShowGallery(gallery = 'new') {
    if (gOnEdit) { if (!confirm('Unsaved work will be lost')) return };
    gOnEdit = false;
    document.querySelector('.pics-gallery').style.display = 'grid';
    document.querySelector('.meme-editor').style.display = 'none';
    var imgs = (gallery === 'new') ? getImages() : getSavedMemes();//loadFromStorage('meows')
    renderGallry(imgs)
};
function renderGallry(items = getImages()) {
    if (!items) return;
    var type = items[0].type;
    document.querySelector('.pics-gallery').innerHTML = items.map(item => `<div style="background-image: url(${item.url})" onclick="onSetMeme('${item.id}','${type}')"></div>`).join('\n');
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
function matchToolsDisplayWithCurrLine() {
    var meme = getMeme()
    var currLine = meme.selectedLineIdx;
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
}
