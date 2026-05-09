import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

print("Importing app.database...")
from app.database import engine, Base
print("Imported app.database")

print("Importing app.models.database_models...")
from app.models import database_models
print("Imported app.models.database_models")

print("Importing app.routers.chat...")
from app.routers import chat
print("Imported app.routers.chat")

print("Importing app.routers.report...")
from app.routers import report
print("Imported app.routers.report")

print("Importing app.routers.predict...")
from app.routers import predict
print("Imported app.routers.predict")
