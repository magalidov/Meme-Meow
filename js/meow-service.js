'use strict'
console.log('Service');

var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['snob', 'idea', 'mock', 'politics', 'trump', 'funny', 'joke', 'bad', 'evil', 'red', 'black', 'man', 'men', 'suit'] },
{ id: 2, url: 'img/2.jpg', keywords: ['happy', 'dogs', 'sweet', 'cute', 'kiss', 'love', 'friend', 'animals', 'nature', 'pets', 'good', 'white', 'beige'] },
{ id: 3, url: 'img/3.jpg', keywords: ['baby', 'sweet', 'dogs', 'cute', 'love', 'friends', 'animals', 'comfort', 'pets', 'good', 'white', 'brown', 'sleep', 'bed'] },
{ id: 4, url: 'img/4.jpg', keywords: ['happy', 'sweet', 'cats', 'cute', 'love', 'friends', 'animals', 'comfort', 'pets', 'good', 'grey', 'computer', 'pc', 'coding', 'keyboard', 'sleep'] },
{ id: 5, url: 'img/5.jpg', keywords: ['baby', 'sweet', 'funny', 'cute', 'win', 'idea', 'determined', 'beach', 'bright', 'happy', 'good', 'white', 'green', 'blond', 'kid'] },
{ id: 6, url: 'img/6.jpg', keywords: ['smart', 'snob', 'sceince', 'tv', 'television', 'history', 'funny', 'idea', 'explain', 'hair', 'happened', 'case', 'brown', 'man', 'men', 'smile', 'suit'] },
{ id: 7, url: 'img/7.jpg', keywords: ['baby', 'sweet', 'funny', 'cute', 'eyes', 'idea', 'surprised', 'shock', 'hold', 'happy', 'good', 'brown', 'blue', 'blond', 'kid', 'shock'] },
{ id: 8, url: 'img/8.jpg', keywords: ['smart', 'snob', 'hat', 'madness', 'alice', 'keep', 'funny', 'mock', 'explain', 'suit', 'happened', 'fantasy', 'purple', 'man', 'men', 'smile'] },
{ id: 9, url: 'img/9.jpg', keywords: ['baby', 'evil', 'funny', 'cute', 'eyes', 'scheme', 'plot', 'mock', 'nature', 'happy', 'grass', 'green', 'asian', 'kid', 'laugh'] },
{ id: 10, url: 'img/10.jpg', keywords: ['laugh', 'smile', 'obama', 'politics', 'funny', 'joke', 'face', 'brown', 'man', 'men', 'suit'] },
{ id: 11, url: 'img/11.jpg', keywords: ['kiss', 'moment', 'funny', 'basketball', 'sports', 'love', 'friends', 'gay', 'brown', 'green', 'men'] },
{ id: 12, url: 'img/12.jpg', keywords: ['you', 'want', 'tv', 'television', 'man', 'men', 'funny', 'surprise', 'idea', 'guilty', 'finger', 'pointing'] },
{ id: 13, url: 'img/13.jpg', keywords: ['smart', 'snob', 'toast', 'movies', 'actors', 'look', 'funny', 'face', 'hair', 'mock', 'case', 'brown', 'black', 'blue', 'wine', 'glass', 'event', 'man', 'men', 'smile', 'suit'] },
{ id: 14, url: 'img/14.jpg', keywords: ['smart', 'snob', 'glass', 'movies', 'sunglass', 'matrix', 'cold', 'keep', 'sci-fi', 'mock', 'explain', 'serius', 'happened', 'fantasy', 'green', 'man', 'men', 'angry'] },
{ id: 15, url: 'img/15.jpg', keywords: ['precise', 'snob', 'hair', 'madness', 'zero', 'you', 'funny', 'mock', 'fantasy', 'bright', 'man', 'men', 'smile'] },
{ id: 16, url: 'img/16.jpg', keywords: ['happy', 'smart', 'snob', 'hand', 'movies', 'laugh', 'sci-fi', 'mock', 'explain', 'happened', 'fantasy', 'red', 'man', 'men', 'shock'] },
{ id: 17, url: 'img/17.jpg', keywords: ['snob', 'two', 'fingers', 'mock', 'politics', 'putin', 'joke', 'bad', 'russia', 'red', 'black', 'man', 'men', 'suit'] },
{ id: 18, url: 'img/18.jpg', keywords: ['movies', 'fantasy', 'toys', 'future', 'bazz', 'udi', 'sad', 'explain', 'suit', 'happened', 'bright', 'man', 'men', 'smile', 'friends'] }
];
var gKeywords = { 'happy': 12, 'funny puk': 1 };
var gMeme;
function setMeme(imgId, canvasWidth, canvasHeight) {
    gMeme = {
        memeId: makeId(),
        selectedImgId: imgId,
        selectedImgUrl: `img/${imgId}.jpg`,
        selectedLineIdx: 0,
        lines: [{ txt: 'Your Joke', size: 50, x: (canvasWidth / 2), y: 70, font: 'impact', align: 'center', fill: 'black', stroke: 'white', strokeWidth: 2 },
        { txt: 'Your Joke', size: 50, x: (canvasWidth / 2), y: canvasHeight - 30, font: 'impact', align: 'center', fill: 'black', stroke: 'white', strokeWidth: 2 }]
    };
};

// GALLERY
function filterGallery(key) {
    var filterdImgs = gImgs.filter(img => img.keywords.find(word => word.includes(key)))
    return filterdImgs
}

// PERMISSIONS
function getImages() {
    return gImgs;
};
function getMeme() {
    return gMeme;
};
function getSearchKeys() {
    return gKeywords
}

// EDIT G-MEME
function editMemeLine(set, content, lineIdx = gMeme.selectedLineIdx) {
    gMeme.lines[lineIdx][set] = (isNaN(content)) ? content : gMeme.lines[lineIdx][set] + content;
};
function switchLine(idx = false) {
    if (idx === false) gMeme.selectedLineIdx = (gMeme.selectedLineIdx < gMeme.lines.length - 1) ? gMeme.selectedLineIdx + 1 : 0
    else gMeme.selectedLineIdx = idx
}
function newLine(canvasWidth, canvasHeight) {
    gMeme.lines.push({ txt: 'Your Joke', size: 50, x: (canvasWidth / 2), y: (canvasHeight / 2), font: 'impact', align: 'center', fill: 'black', stroke: 'white', strokeWidth: 2 })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}
function deleteCurrLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
}






















