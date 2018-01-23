'use strict';

function update(stream) {
    var inpV = document.getElementById('inpVideo').value;
    if (inpV == '') {
        alert('Video Url is Null');
    } else {
        document.getElementById('myVideo').src = inpV
        document.getElementById('myVideo').play();
    }
}

function demoPlay(src) {
    var len = src.lastIndexOf('.gif');
    if (len > -1) {
        var url = src.substring(0, len) + '.webm';
        document.getElementById('myVideo').src = url;
    }
    document.getElementById('myVideo').play();
}
/*
var chromeVideo = document.getElementById('chrome');
var containerDiv = document.getElementById('myVideo');
var video1 = document.getElementById('video1');
var video2 = document.getElementById('video2');

function toggleChromeVideo() {
    if (chromeVideo.classList.contains('transparent')) {
chromeVideo.classList.remove('transparent');
        chromeVideo.play();
    } else {
        chromeVideo.classList.add('transparent');
        chromeVideo.pause();
    }
}

chromeVideo.addEventListener('gesturedoubletap', toggleChromeVideo, false);
containerDiv.addEventListener('gesturedoubletap', toggleChromeVideo, false);

function addEventListeners(video) {
    video.addEventListener('dblclick', handleDoubleClick, false);
    video.addEventListener('pointerdown', handlePointerDown, false);
    video.addEventListener('pointerup', handlePointerUp, false);
    video.addEventListener('pointermove', handlePointerMove, false);
}
addEventListeners(video1);
addEventListeners(video2);

function handleDoubleClick(event) {
    var video = event.srcElement;
    video.classList.remove('rotateOut');
    setTimeout(function() {
        video.classList.add('rotateOut');
    }, 5);
    event.preventDefault();
}

var isPointerDown = false;

function handlePointerDown(event) {
    isPointerDown = true;
    var video = event.srcElement;
    video.style.opacity = 0.7;
    video.style.webkitFilter = 'blur(3px) grayscale(1)';
    video.style.zIndex = video.style.zIndex + 1;
    event.preventDefault();
}

function handlePointerUp(event) {
    isPointerDown = false;
    var video = event.srcElement;
    video.style.opacity = 2;
    video.style.webkitFilter = 'blur(0px)';
    event.preventDefault();
}

function handlePointerMove(event) {
    if (!isPointerDown) {
        return;
    }
    var video = event.srcElement;
    var videoWidth = video.clientWidth;
    var videoHeight = video.clientHeight;

    video.style.left = (event.clientX - videoWidth / 2) + 'px';
    video.style.top = (event.clientY - videoHeight / 2) + 'px';

    event.preventDefault();
}
*/