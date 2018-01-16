import object_detection_api
import os
import ssl
from PIL import Image
from flask import Flask, request, Response
from flask_sslify import SSLify

app = Flask(__name__)
#sslify = SSLify(app, subdomains = True)#HSTS 정책에 하위 도메인을 포함
#sslify = SSLify(app)

# for CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST') # Put any other methods you need here
    return response


@app.route('/', methods=['GET','POST'])
def index():
    return Response('NextDoor Object Detection Sample Page')


@app.route('/local', methods=['GET','POST'])
def local():
    return Response(open('./static/local.html').read(), mimetype="text/html")


@app.route('/video', methods=['GET','POST'])
def remote():
    return Response(open('./static/video.html').read(), mimetype="text/html")


@app.route('/test', methods=['GET','POST'])
def test():
    try:
        CWD_PATH = os.getcwd()
        PATH_TO_TEST_IMAGES_DIR = CWD_PATH + '/images'
        TEST_IMAGE_PATHS = [os.path.join(PATH_TO_TEST_IMAGES_DIR, 'image{}.jpg'.format(i)) for i in range(1, 3)]
    
        image = Image.open(TEST_IMAGE_PATHS[0])
        objects = object_detection_api.get_objects(image)
        print('objects :', objects)
        return objects
    
    except Exception as e:
        print('POST /test error: %e', e)
        return e

@app.route('/image', methods=['GET','POST'])
def image():
    try:
        image_file = request.files['image']  # get the image

        # Set an image confidence threshold value to limit returned data
        threshold = request.form.get('threshold')
        if threshold is None:
            threshold = 0.5
        else:
            threshold = float(threshold)

        # finally run the image through tensor flow object detection`
        image_object = Image.open(image_file)
        objects = object_detection_api.get_objects(image_object, threshold)
        return objects

    except Exception as e:
        print('POST /image error: %e', e)
        return e


if __name__ == '__main__':
	# without SSL
    #app.run(debug=True, host='0.0.0.0')

	# with SSL
    ssl_context = 'adhoc'
    app.run(debug=True, host='0.0.0.0', port=5000, ssl_context=ssl_context)
