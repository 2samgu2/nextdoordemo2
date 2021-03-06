# -*- coding: utf-8 -*-
import object_detection_api
import os
import ssl
from OpenSSL import SSL
from PIL import Image
from flask import Flask, request, Response
from flask import render_template
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
    return render_template('index.html', name='index')

@app.route('/cam', methods=['GET','POST'])
def cam():
    return render_template('cam.html', name='cam')

@app.route('/video', methods=['GET','POST'])
def video():
    return render_template('video.html', name='video')

@app.route('/image', methods=['GET','POST'])
def image():
    return render_template('image.html', name='image')


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

@app.route('/frame', methods=['GET','POST'])
def frame():
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
    #ssl_context = 'adhoc'
    #app.run(debug=True, host='0.0.0.0', port=5000, ssl_context=ssl_context)
    #context = ('S:/development_environment/dev/설치파일/AWS/server-ssl/future.crt', 'S:/development_environment/dev/설치파일/AWS/server-ssl/future.key')
    context = (os.getcwd()+'/future.crt', os.getcwd()+'/future.key')
    app.run(debug=True, host='0.0.0.0', port=5000, ssl_context=context)