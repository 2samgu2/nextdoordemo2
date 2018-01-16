# -*- coding: utf-8 -*-
import numpy as np
import os
import six.moves.urllib as urllib
import tarfile
import tensorflow as tf
from json import dumps
import json

if tf.__version__ != '1.4.0':
  raise ImportError('Please upgrade your tensorflow installation to v1.4.0!')


# Object detection imports
from object_detection.utils import label_map_util    ### CWH: Add object_detection path

# Model Preparation
CWD_PATH = os.getcwd()
MODEL_NAME = 'ssd_mobilenet_v1_coco_2017_11_17'
PATH_TO_CKPT = os.path.join(CWD_PATH, MODEL_NAME, 'frozen_inference_graph.pb')
PATH_TO_LABELS = os.path.join(CWD_PATH, 'data', 'mscoco_label_map.pbtxt')
NUM_CLASSES = 90

# Load a (frozen) Tensorflow model into memory.
detection_graph = tf.Graph()
with detection_graph.as_default():
  od_graph_def = tf.GraphDef()
  with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
    serialized_graph = fid.read()
    od_graph_def.ParseFromString(serialized_graph)
    tf.import_graph_def(od_graph_def, name='')

# Loading label map
label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
category_index = label_map_util.create_category_index(categories)


# Helper code
def load_image_into_numpy_array(image):
  (im_width, im_height) = image.size
  return np.array(image.getdata()).reshape(
      (im_height, im_width, 3)).astype(np.uint8)

with detection_graph.as_default():
  config = tf.ConfigProto()
  config.gpu_options.allow_growth = True
  with tf.Session(graph=detection_graph, config=config) as sess:
    # Definite input and output Tensors for detection_graph
    image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
    # Each box represents a part of the image where a particular object was detected.
    detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
    # Each score represent how level of confidence for each of the objects.
    # Score is shown on the result image, together with the class label.
    detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
    detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
    num_detections = detection_graph.get_tensor_by_name('num_detections:0')

# added to put object in JSON
class Object(object):
    def __init__(self):
        self.name="Nextdoor. Object Detection REST API"

    def toJSON(self):
        return json.dumps(self.__dict__)
'''
class JsonSerializable(object):
    def toJson(self):
        return json.dumps(self.__dict__)

    def __repr__(self):
        return self.toJson()
'''


def get_objects(image, threshold=0.5):
    image_np = load_image_into_numpy_array(image)
    # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
    image_np_expanded = np.expand_dims(image_np, axis=0)
    # Actual detection.
    (boxes, scores, classes, num) = sess.run(
        [detection_boxes, detection_scores, detection_classes, num_detections],
        feed_dict={image_tensor: image_np_expanded})

    classes = np.squeeze(classes).astype(np.int32)
    scores = np.squeeze(scores)
    boxes = np.squeeze(boxes)

    obj_above_thresh = sum(n > threshold for n in scores)
    print("detected %s objects in image above a %s score" % (obj_above_thresh, threshold))

    output = []

    # Add some metadata to the output
    item = Object()
    item.version = "0.0.1"
    item.numObjects = obj_above_thresh
    item.threshold = threshold
    output.append(item)

    for c in range(0, len(classes)):
        class_name = category_index[classes[c]]['name']
        if scores[c] >= threshold:      # only return confidences equal or greater than the threshold
            print(" object %s - score: %s, coordinates: %s" % (class_name, scores[c], boxes[c]))

            item = Object()
            item.name = 'Object'
            item.class_name = class_name
            item.score = float(scores[c])
            item.y = float(boxes[c][0])
            item.x = float(boxes[c][1])
            item.height = float(boxes[c][2])
            item.width = float(boxes[c][3])

            output.append(item)

    outputJson = json.dumps([ob.__dict__ for ob in output], default=str)
    
    return outputJson
