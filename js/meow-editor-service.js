'use strict'
console.log('Service');

var gMeme;

// SET MEME DATA
function setMeme(id,type, canvasWidth, canvasHeight) {
    if (type==='item'){
        gMeme = {
            id: makeId(),
            type: 'item',
            selectedImgId: +id,
            selectedImgUrl: `img/${id}.jpg`,
            selectedLineIdx: 0,
            lines: [{ txt: '', size: 50, x: 250, y: 70, canvasWidth:500,canvasHeight:500,  font: 'impact', align: 'center', fill: '#000000', stroke: '#ffffff', strokeWidth: 2 },
            { txt: '', size: 50, x: 250, y: 470, canvasWidth:500,canvasHeight:500, font: 'impact', align: 'center', fill: '#000000', stroke: '#ffffff', strokeWidth: 2 }]
            // lines: [{ txt: '', size: 50, x: (canvasWidth / 2), y: 70,canvasWidth:500,canvasHeight:500,  font: 'impact', align: 'center', fill: '#000000', stroke: '#ffffff', strokeWidth: 2 },
            // { txt: '', size: 50, x: (canvasWidth / 2), y: canvasHeight - 30,canvasWidth:500,canvasHeight:500, font: 'impact', align: 'center', fill: '#000000', stroke: '#ffffff', strokeWidth: 2 }]
        };
    } else if (type==='meme'){
        gMeme = gSavedMemes.find(meme => meme.id === id).memeSet;
    } 
};

// EDITING G-MEME
function editMemeLine(set, content, lineIdx = gMeme.selectedLineIdx) {
    gMeme.lines[lineIdx][set] = (isNaN(content)||content==='') ? content : gMeme.lines[lineIdx][set] + content;
};
function switchLine(idx = false) {
    if (idx === false) gMeme.selectedLineIdx = (gMeme.selectedLineIdx < gMeme.lines.length - 1) ? gMeme.selectedLineIdx + 1 : 0;
    else gMeme.selectedLineIdx = idx;
}
function newLine(canvasWidth, canvasHeight) {                                                   
    gMeme.lines.push({ txt: '', size: 50, x: (canvasWidth / 2), y: (canvasHeight / 2),canvasWidth:canvasWidth,canvasHeight:canvasHeight, font: 'impact', align: 'center', fill: 'black', stroke: 'white', strokeWidth: 2 });
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}
function deleteCurrLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
}

// PERMISSION FROM SERVICE
function getMeme() {
    return gMeme;
};

// SAVING MEME DATA
function createSavedMemesData(dataUrl) {
    gMeme.type = 'meme';
    var meows = loadFromStorage('meows');
    var currKeys = gImgs.find(img => img.id === gMeme.selectedImgId).keywords;
    var memeToSave = { id: gMeme.id , url: dataUrl, memeSet: gMeme, dateCreated: new Date() ,type:'meme', keywords: currKeys};
    var savedMemes = [];
    if (!meows) {
        savedMemes[0]= memeToSave;
        saveToStorage('meows',savedMemes);
    } else {
        savedMemes = meows;
        savedMemes.push(memeToSave);
        saveToStorage('meows',savedMemes);
    }
    loadSavedMemsData();
}

function calibrateMeme(newWidth, newHeight){
    for (var i = 0; i < gMeme.lines.length ; i++){
        var lastCnvsW =gMeme.lines[i].canvasWidth
        var lastCnvsH =gMeme.lines[i].canvasHeight
        gMeme.lines[i].x = (gMeme.lines[i].x*newWidth)/lastCnvsW
        gMeme.lines[i].y = (gMeme.lines[i].y*newHeight)/lastCnvsH
        gMeme.lines[i].canvasWidth = newWidth
        gMeme.lines[i].canvasHeight = newHeight
    }
}




















