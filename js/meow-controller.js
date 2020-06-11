'use strict'
console.log('Controller');

var gDrag = false
var gOnEdit = false;
var gElCanvas;
var gCtx;

function onInit() {
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
    var imgs = getImages()
    renderGallry(imgs);
    resizeCanvas();
    setKeywords()
    renderSearchBox()
}
function resizeCanvas() {
    if (gOnEdit) return
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
    var meme = getMeme()
    if (meme) {
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
    document.querySelector('.search-box').style.display ='none'
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
    gOnEdit = true
    newLine(gElCanvas.width, gElCanvas.height)
    renderMeme()
}
function onDeleteLine() {
    gOnEdit = true
    deleteCurrLine()
    renderMeme()
}
// SEARCH
function onStartSearch(key,input='') {
    onShowGallery()
    var filterdImgs = filterGallery(key)
    renderGallry(filterdImgs)
    if (updateKeywords(key)) renderSearchBox(key,input)
}
// RENDER SEARCH BOX
function onToggleSearchBox() {
    var elBoxStyle = document.querySelector('.search-box').style
    elBoxStyle.display = (!elBoxStyle.display||elBoxStyle.display==='none') ?'flex' : 'none'
}
function renderSearchBox(savedInput='',input) {
    savedInput = (input!=='keypress')? savedInput : ''
    var keys = getSearchKeys()
    var keysHTML = ''
    for (var key in keys) {
        if (keys[key] > 3) {
            keysHTML += `<a onclick="onStartSearch('${key}','keypress')" style="color:rgba(1${10 - keys[key]}0, 1${10 - keys[key]}0, 1${10 - keys[key]}0); font-size:${keys[key] * 0.20}rem" class="key-word">${key}</a>`
        }
    }
    var strHTML = `
    <input oninput="onStartSearch(this.value)" class="search-input" data-type="txt" placeholder="Search" type="text" value="${savedInput}" autofocus>
    ${keysHTML}`
    document.querySelector('.search-box').innerHTML = strHTML
}

// RENDER GALLERY
function onShowGallery(gallery='new') {
    if (gOnEdit) { if (!confirm('Unsaved work will be lost')) return }
    gOnEdit = false
    document.querySelector('.pics-gallery').style.display = 'grid';
    document.querySelector('.meme-editor').style.display = 'none';
    var imgs = (gallery === 'new') ? getImages() : [loadFromStorage('meows')]
    renderGallry(imgs)
};
function renderGallry(imgs) {
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

// DRAG OBJECTS
function onMouseAboveObject(ev) {
    if (gDrag) return
    var { offsetX, offsetY } = ev;
    var meme = getMeme()
    var objectIdx = meme.lines.findIndex(line => ((line.y - line.size) < offsetY && offsetY < line.y))
    if (objectIdx >= 0) document.body.style.cursor = 'grab'
    if (objectIdx < 0) document.body.style.cursor = 'default'
}
function onPickObject(ev) {
    gDrag = true
    if (ev.type === 'touchstart') {
        ev.preventDefault()
        var offsetXY = recoverOffsetValues(ev)
        offsetX = offsetXY[0]
        offsetY = offsetXY[1]
    } else {
        var { offsetX, offsetY } = ev;
    }
    var meme = getMeme()
    var objectIdx = meme.lines.findIndex(line => ((line.y - line.size) < offsetY && offsetY < line.y))
    document.querySelector('.txt-input').value=`${meme.lines[objectIdx].txt}`;
    switchLine(objectIdx)
    renderMeme()
}
function onDrag(ev) {
    var meme = getMeme()
    if (gDrag === false) return
    if (meme.selectedLineIdx < 0) return
    gOnEdit = true
    if (ev.type === 'touchmove' || ev.type === 'touchstart') {
        ev.preventDefault()
        var offsetXY = recoverOffsetValues(ev)
        offsetX = offsetXY[0]
        offsetY = offsetXY[1]
    } else {
        var { offsetX, offsetY } = ev;
    }
    var meme = getMeme()
    meme.lines[meme.selectedLineIdx].x = offsetX
    meme.lines[meme.selectedLineIdx].y = offsetY
    renderMeme()
}
function onDropObject() {
    gDrag = false
    document.body.style.cursor = 'default'
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
