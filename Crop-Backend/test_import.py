import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
print("Importing app.main...")
from app.main import app
print("Imported app.main successfully")
import tensorflow as tf
print("TensorFlow version:", tf.__version__)
