'use strict';
const s = document.getElementById('objDetect');
const sourceImg = s.getAttribute("data-source");  //the source image to use
const scoreThreshold = s.getAttribute("data-scoreThreshold") || 0.5;
const apiServer = s.getAttribute("data-apiServer") || window.location.origin + '/frame'; //the full TensorFlow Object Detection API server url

let imageCanvas = document.createElement('canvas');
let imageCtx = imageCanvas.getContext("2d");
let drawCanvas = document.getElementById('myCanvas');
let drawCtx = drawCanvas.getContext("2d");

function imgChange() {
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
        var image = document.getElementById(sourceImg);
        image.src = this.result;
        imageCtx.drawImage(image, 0, 0, image.width, image.height);
        imageCanvas.toBlob(postFile, 'image/jpeg');
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
} 

var data = document.querySelector('p#data');
function plog(message) {
    data.innerHTML = message + '<br><br>' + data.innerHTML;
}

function drawBoxes(objects) {

    //clear the previous drawings
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

    //filter out objects that contain a class_name and then draw boxes and labels on each
    objects.filter(object => object.class_name).forEach(object => {
        let x = object.x * drawCanvas.width;
        let y = object.y * drawCanvas.height;
        let width = (object.width * drawCanvas.width) - x;
        let height = (object.height * drawCanvas.height) - y;

        plog('Label : ' + object.class_name + ', Score : ' + Math.round(object.score * 100) + '%');
        drawCtx.fillText(object.class_name + " - " + Math.round(object.score * 100) + "%", x + 5, y + 20);
        drawCtx.strokeRect(x, y, width, height);
    });
}

function postFile(file) {
    console.log('postFile',file);
    let formdata = new FormData();
    formdata.append("image", file);
    formdata.append("threshold", scoreThreshold);
    
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
            }
        });
    });
}