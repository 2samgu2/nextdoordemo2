# Tensorflow Object Detection API Web Service
This is an example of how to turn the [TensorFlow Object API](https://github.com/tensorflow/models/tree/master/research/object_detection) into a web service. 
A Python Flask web server is used to interact with a JavaScript a client library. 
The example shows how you can extract frames from WebRTC's getUserMedia, upload them to the API, and then use the canvas to display them.
This allows use of the TensorFlow Object API on any HTML `<video>` element.


## Installation
### Install
```$xslt
git clone 
cd NextDoorDemo2
python server.py
```

### Manual install
Follow the TensorFlow Object API install [instructions](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/installation.md).
Then run the the instructions above.


## Example web apps
Point your browser to:
- `https://localhost:5000/local` - shows a mirrored video from a webcam
- `https://localhost:5000/video` - shows object detection running on a HTML `<video>` tag


## Browser support
WebRTC browsers have secure origin restrictions: 
- Chrome will only work on `localhost` unless you add TLS certificates to your server
- Firefox will work on any domain as long as you allow it
- Safari will work, but you will need to "Allow Media Capture on Insecure Domains" 

These should all work fine with any other video source.

Edge is currently not supported (polyfill for `canvas.toBlob` needed)


## API Details
Point to a `<script>` tag to `objDetect.js` with an id of `objDetect`. Include `data-source="myVideo"` and other optional `data-` tags to set parameters.

Example:
```$xslt
<script id="objDetect" src="/static/objDetect.js" data-source="myVideo" data-mirror="true" data-uploadWidth="1280" data-scoreThreshold="0.40"></script>
```

Data tags:
- `data-source` - the ID of the source `<video>` to use. Must be specified.
- `data-uploadWidth` - the width of the upload file. Height will automatically be calculated based on the source video's aspect ratio. Default is `640`.
- `data-mirror` - mirror the boundary boxes. Used is the image is mirrored (as is usual with a local getUserMedia view). Default is `false`.
- `data-scoreThreshold` - only show objects above this confidence threshold. Default is `0.5`
 - `data-apiServer` - the full URL of the TensorFlow Object Detection Web API server location. Default is `/image` off of the current domain - 
 i.e. `https://localhost:5000/image`


