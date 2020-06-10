'use strict'
console.log('Service');

var gKeywords = { 'happy': 12, 'funny puk': 1 };

var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['happy'] },
{ id: 2, url: 'img/2.jpg', keywords: ['happy'] },
{ id: 3, url: 'img/3.jpg', keywords: ['happy'] },
{ id: 4, url: 'img/4.jpg', keywords: ['happy'] },
{ id: 5, url: 'img/5.jpg', keywords: ['happy'] },
{ id: 6, url: 'img/6.jpg', keywords: ['happy'] },
{ id: 7, url: 'img/7.jpg', keywords: ['happy'] },
{ id: 8, url: 'img/8.jpg', keywords: ['happy'] },
{ id: 9, url: 'img/9.jpg', keywords: ['happy'] },
{ id: 10, url: 'img/10.jpg', keywords: ['happy'] },
{ id: 11, url: 'img/11.jpg', keywords: ['happy'] },
{ id: 12, url: 'img/12.jpg', keywords: ['happy'] },
{ id: 13, url: 'img/13.jpg', keywords: ['happy'] },
{ id: 14, url: 'img/14.jpg', keywords: ['happy'] },
{ id: 15, url: 'img/15.jpg', keywords: ['happy'] },
{ id: 16, url: 'img/16.jpg', keywords: ['happy'] },
{ id: 17, url: 'img/17.jpg', keywords: ['happy'] },
{ id: 18, url: 'img/18.jpg', keywords: ['happy'] }
];

var gMeme = {
    selectedImgId: 4,
    selectedLineIdx: { x: 100, y: 70 },
    lines: [{ txt: 'Your Joke', size: 60, x: 100, y: 70, align: 'left', fill: 'black', stroke: 'white' }]
}


function setMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: { x: 100, y: 70 },
        lines: [{ txt: 'Your Joke', size: 60, x: 100, y: 70, align: 'left', fill: 'black', stroke: 'white' }]
    }
}
function getMeme(){
    return gMeme
}





















