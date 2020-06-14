'use strict'
console.log('Gallery-Controller');
var gDisplayGallery = 'new'
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
// Modal
function onShowGallery(gallery) {
    gDisplayGallery = gallery
    if (!gOnEdit) showGallery()
    else openModal()
};
function openModal(){
    document.querySelector('.unsaved-warning-modal').style.display='block';
}
function onCloseModal(){
    document.querySelector('.unsaved-warning-modal').style.display='none'
}
function onContinueToGallery(save=false){
    if (save) onSaveMeme()
    onCloseModal()
    showGallery()
}
// RENDER GALLERY
function showGallery(){
    gOnEdit = false;
    document.querySelector('.pics-gallery').style.display = 'grid';
    document.querySelector('.meme-editor').style.display = 'none';
    var imgs = (gDisplayGallery === 'new') ? getImages() : getSavedMemes();
    renderGallry(imgs)
}

function renderGallry(items = getImages()) {
    if (!items) return;
    // var deleteButton = (items[0].type)? `<button class="delete-saved-btn" onclick="onDeleteSavedMeme()"></button>`
    var type = items[0].type;
    document.querySelector('.pics-gallery').innerHTML = items.map(item => `<div style="background-image: url(${item.url})" onclick="onSetMeme('${item.id}','${type}')"></div>`).join('\n');
}