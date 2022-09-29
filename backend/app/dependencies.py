from .database import SessionLocal

import boto3
import os

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_s3_resource():
    s3_resource = boto3.resource('s3', endpoint_url=os.getenv('AWS_S3_ENDPOINT'))
    return s3_resource
