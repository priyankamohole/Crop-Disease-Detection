import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf
print("TensorFlow version:", tf.__version__)
model = tf.keras.Sequential([tf.keras.layers.Dense(10)])
print("Model created successfully")
