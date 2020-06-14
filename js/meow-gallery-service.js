'use strict'
console.log('Gallery-Service');

// IMGS DATA
var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['arrogant', 'idea', 'mock', 'politics', 'trump', 'funny', 'joke', 'bad', 'evil', 'red', 'black', '', 'men', 'suit'],type:'item' },
{ id: 2, url: 'img/2.jpg', keywords: ['happy', 'dogs', 'sweet', 'cute', 'kiss', 'love', 'friends', 'animals', 'nature', 'pets', 'good', 'white', 'beige'],type:'item' },
{ id: 3, url: 'img/3.jpg', keywords: ['baby', 'sweet', 'dogs', 'cute', 'love', 'friends', 'animals', 'comfort', 'pets', 'good', 'white', 'brown', 'sleep', 'bed'],type:'item' },
{ id: 4, url: 'img/4.jpg', keywords: ['happy', 'sweet', 'cats', 'cute', 'love', 'friends', 'animals', 'comfort', 'pets', 'good', 'grey', 'computer', 'pc', 'coding', 'keyboard', 'sleep'],type:'item' },
{ id: 5, url: 'img/5.jpg', keywords: ['baby', 'sweet', 'funny', 'cute', 'win', 'idea', 'determined', 'beach', 'bright', 'happy', 'good', 'white', 'green', 'blond', 'kid'],type:'item' },
{ id: 6, url: 'img/6.jpg', keywords: ['smart', 'arrogant', 'sceince', 'tv', 'television', 'history', 'funny', 'idea', 'explain', 'hair', 'happened', 'case', 'brown', '', 'men', 'smile', 'suit'],type:'item' },
{ id: 7, url: 'img/7.jpg', keywords: ['baby', 'sweet', 'funny', 'cute', 'eyes', 'idea', 'surprised', 'shock', 'hold', 'happy', 'good', 'brown', 'blue', 'blond', 'kid', 'shock'],type:'item' },
{ id: 8, url: 'img/8.jpg', keywords: ['smart', 'arrogant', 'hat', 'madness', 'alice', 'keep', 'funny', 'mock', 'explain', 'suit', 'happened', 'fantasy', 'purple', '', 'men', 'smile'],type:'item' },
{ id: 9, url: 'img/9.jpg', keywords: ['baby', 'evil', 'funny', 'cute', 'eyes', 'scheme', 'plot', 'mock', 'nature', 'happy', 'grass', 'green', 'asian', 'kid', 'laugh'],type:'item' },
{ id: 10, url: 'img/10.jpg', keywords: ['laugh', 'smile', 'obama', 'politics', 'funny', 'joke', 'face', 'brown', 'men', 'suit'],type:'item' },
{ id: 11, url: 'img/11.jpg', keywords: ['kiss', 'moment', 'funny', 'basketball', 'sports', 'love', 'friends', 'gay', 'brown', 'green', 'men'],type:'item' },
{ id: 12, url: 'img/12.jpg', keywords: ['you', 'want', 'tv', 'television', 'men', 'funny', 'surprise', 'idea', 'guilty', 'finger', 'pointing'],type:'item' },
{ id: 13, url: 'img/13.jpg', keywords: ['smart', 'arrogant', 'toast', 'movies', 'actors', 'look', 'funny', 'face', 'hair', 'mock', 'case', 'brown', 'black', 'blue', 'wine', 'glass', 'event', 'men', 'smile', 'suit'],type:'item' },
{ id: 14, url: 'img/14.jpg', keywords: ['smart', 'arrogant', 'glass', 'movies', 'sunglass', 'matrix', 'cold', 'keep', 'sci-fi', 'mock', 'explain', 'serius', 'happened', 'fantasy', 'green', 'men', 'angry'],type:'item' },
{ id: 15, url: 'img/15.jpg', keywords: ['precise', 'arrogant', 'hair', 'madness', 'zero', 'you', 'funny', 'mock', 'fantasy', 'bright', 'men', 'smile'],type:'item' },
{ id: 16, url: 'img/16.jpg', keywords: ['happy', 'smart', 'arrogant', 'hand', 'movies', 'laugh', 'sci-fi', 'mock', 'explain', 'happened', 'fantasy', 'red', 'men', 'shock'],type:'item' },
{ id: 17, url: 'img/17.jpg', keywords: ['arrogant', 'two', 'fingers', 'mock', 'politics', 'putin', 'joke', 'bad', 'russia', 'red', 'black', 'men', 'suit'],type:'item' },
{ id: 18, url: 'img/18.jpg', keywords: ['movies', 'fantasy', 'toys', 'future', 'bazz', 'udi', 'sad', 'explain', 'suit', 'happened', 'bright', 'men', 'smile', 'friends'],type:'item' }
];
var gSavedMemes=[];
var gKeywords;

// PERMISSIONS FROM SERVICE
function getImages() {
    return gImgs;
};
function getSearchKeys() {
    return gKeywords;
};
function getSavedMemes(){
    return gSavedMemes;
};

// GALLERY
function filterGallery(key) {
    var filterdImgs = gImgs.filter(img => img.keywords.find(word => word.includes(key)));
    return filterdImgs;
}
// SAVED
function loadSavedMemsData(){
    var meows = loadFromStorage('meows');
    gSavedMemes = (meows) ? meows : null;
}
// SEARCH
function setKeywords() {
    gKeywords = gImgs.reduce((acc, img) => {
        img.keywords.forEach(word => {
            if (!acc[word]) acc[word] = 1;
            else acc[word]++;
        })
        return acc;
    }, {})
}
function updateKeywords(key) {
    if (gKeywords[key]) {
        gKeywords[key]++;
        return true;
    }
}
