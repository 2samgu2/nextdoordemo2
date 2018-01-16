import object_detection_api
import os
from PIL import Image

# TEST
CWD_PATH = os.getcwd()
PATH_TO_TEST_IMAGES_DIR = CWD_PATH + '/images'
TEST_IMAGE_PATHS = [ os.path.join(PATH_TO_TEST_IMAGES_DIR, 'image{}.jpg'.format(i)) for i in range(1, 3) ]

for image_path in TEST_IMAGE_PATHS:
    image = Image.open(image_path)
    response = object_detection_api.get_objects(image)
    print("returned JSON: \n%s" % response)