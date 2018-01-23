/**
 * Created by chad hart on 11/30/17.
 * Client side of Tensor Flow Object Detection Web API
 * Written for NextDoor. - https://thenextdoor.co.kr
 */

//Parameters
const s = document.getElementById('objDetect');
const sourceVideo = s.getAttribute("data-source");  //the source video to use
const uploadWidth = s.getAttribute("data-uploadWidth") || 640; //the width of the upload file
const mirror = s.getAttribute("data-mirror") || false; //mirror the boundary boxes
const scoreThreshold = s.getAttribute("data-scoreThreshold") || 0.5;
const apiServer = s.getAttribute("data-apiServer") || window.location.origin + '/frame'; //the full TensorFlow Object Detection API server url

//Video element selector
v = document.getElementById(sourceVideo);

//for starting events
let isPlaying = false,
    gotMetadata = false;

//Canvas setup

//create a canvas to grab an image for upload
let imageCanvas = document.createElement('canvas');
let imageCtx = imageCanvas.getContext("2d");

//create a canvas for drawing object boundaries
let drawCanvas = document.getElementById('myCanvas');
//document.getElementById('myCanvas') = drawCanvas
//document.body.appendChild(drawCanvas);
let drawCtx = drawCanvas.getContext("2d");

var data = document.querySelector('p#data');
function plog(message) {
    data.innerHTML = message + '<br><br>' + data.innerHTML;
}

//draw boxes and labels on each detected object
function drawBoxes(objects) {

    //clear the previous drawings
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

    //filter out objects that contain a class_name and then draw boxes and labels on each
    objects.filter(object => object.class_name).forEach(object => {

        let x = object.x * drawCanvas.width;
        let y = object.y * drawCanvas.height;
        let width = (object.width * drawCanvas.width) - x;
        let height = (object.height * drawCanvas.height) - y;

        console.log('mirror:',mirror);
        //flip the x axis if local video is mirrored
        if (mirror) {
            x = drawCanvas.width - (x + width)
        }
/*      
        if (object.class_name == 'person') {
            if (navigator.vibrate) {
                navigator.vibrate(300); // doesn't seem to work in Chrome or Firefox
            } 
        }
*/
        plog('Label : ' + object.class_name + ', Score : ' + Math.round(object.score * 100) + '%');
        drawCtx.fillText(object.class_name + " - " + Math.round(object.score * 100) + "%", x + 5, y + 20);
        drawCtx.strokeRect(x, y, width, height);

    });
}

//Add file blob to a form and post
function postFile(file) {

    //Set options as form data
    let formdata = new FormData();
    formdata.append("image", file);
    formdata.append("threshold", scoreThreshold);
/*
    let xhr = new XMLHttpRequest();
    xhr.open('POST', apiServer, true);
    xhr.onload = function () {
        if (this.status === 200) {
            let objects = JSON.parse(this.response);

            //draw the boxes
            drawBoxes(objects);

            //Save and send the next image
            imageCtx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight, 0, 0, uploadWidth, uploadWidth * (v.videoHeight / v.videoWidth));
            imageCanvas.toBlob(postFile, 'image/jpeg');
            imageCanvas.setAttribute('style', 'z-index:2;width:480px;position:absolute;');
        }
        else {
            console.error(xhr);
        }
    };
    xhr.send(formdata);
*/
    $(function(){
        $.ajax({
            url: apiServer,
            processData: false,
            contentType: false,
            data: formdata,
            type: 'POST',
            success: function(result){
                let objects = JSON.parse(result);

               //draw the boxes
                drawBoxes(objects);

               //Save and send the next image
                imageCtx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight, 0, 0, uploadWidth, uploadWidth * (v.videoHeight / v.videoWidth));
                imageCanvas.toBlob(postFile, 'image/jpeg');
            }
        });
    });
}

//Start object detection
function startObjectDetection() {

    console.log("starting object detection");

    //Set canvas sizes base don input video
    drawCanvas.width = v.videoWidth;
    drawCanvas.height = v.videoHeight;

    imageCanvas.width = uploadWidth;
    imageCanvas.height = uploadWidth * (v.videoHeight / v.videoWidth);

    //Some styles for the drawcanvas
    drawCtx.lineWidth = 4;
    drawCtx.strokeStyle = "cyan";
    drawCtx.font = "20px Verdana";
    drawCtx.fillStyle = "cyan";

    //Save and send the first image
    imageCtx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight, 0, 0, uploadWidth, uploadWidth * (v.videoHeight / v.videoWidth));
    imageCanvas.toBlob(postFile, 'image/jpeg');

}

//Starting events

//check if metadata is ready - we need the video size
v.onloadedmetadata = () => {
    console.log("video metadata ready");
    gotMetadata = true;
    if (isPlaying) {
        startObjectDetection();
    }
};

//see if the video has started playing
v.onplaying = () => {
    console.log("video playing");
    isPlaying = true;
    if (gotMetadata) {
        startObjectDetection();
        document.getElementById('myCanvas').setAttribute('style', 'z-index:2;width:480px;height:100%;position:absolute;');
    }
};

v.onpause = () => {
    document.getElementById('myCanvas').setAttribute('style', 'z-index:-1;width:480px;height:100%;position:absolute;');
    isPlaying = false;
};

function playPause() { 
    if (v.paused) {
        v.play();
        isPlaying = true;
        if (gotMetadata) {
            startObjectDetection();
            document.getElementById('myCanvas').setAttribute('style', 'z-index:2;width:480px;height:100%;position:absolute;');
        }
    } else {
        v.pause(); 
        document.getElementById('myCanvas').setAttribute('style', 'z-index:-1;width:480px;height:100%;position:absolute;');
        isPlaying = false;
    }
} 

