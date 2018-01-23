'use strict';
const s = document.getElementById('objDetect');
const sourceVideo = s.getAttribute("data-source");  //the source video to use
const scoreThreshold = s.getAttribute("data-scoreThreshold") || 0.5;
const apiServer = s.getAttribute("data-apiServer") || window.location.origin + '/frame'; //the full TensorFlow Object Detection API server url

let imageCanvas = document.createElement('canvas');
let imageCtx = imageCanvas.getContext("2d");
let drawCanvas = document.getElementById('myCanvas');
let drawCtx = drawCanvas.getContext("2d");

function imgChange() {
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader()
    reader.onload = function(e) {
        
        //var image = new Image();
        var image = document.getElementById(sourceVideo);
        image.height = drawCanvas.width;
        image.width = drawCanvas.height;
        image.src = e.target.result;
        console.log('e.target.result', e.target.result);
        
        let formdata = new FormData();
        formdata.append("image", image);
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
    };
    reader.readAsDataURL(file);
     
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
