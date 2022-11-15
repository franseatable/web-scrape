'use strict';

const input = document.getElementById('input');
const download = document.getElementById('download');

download.addEventListener('click', () => {
    download.href = './info.html?id='+input.value;

});
