import botocore
import boto3
import os
import uuid

# Upload a File to an S3 Bucket and return an URL to access it (if bucket is public)
def upload_file_to_bucket(s3, bucket_name, file):
    bucket = s3.Bucket(bucket_name)

    # Generate a unique name for the object with a UUID
    filename_with_extension = os.path.splitext(file.filename)
    obj = bucket.Object(f'{filename_with_extension[0]}-{uuid.uuid4()}{filename_with_extension[1]}')

    obj.upload_fileobj(file.file, ExtraArgs={'ContentType': file.content_type})

    # Generate a presigned URL without the signature
    s3_client = boto3.client('s3')
    s3_config = s3_client._client_config
    s3_config.signature_version = botocore.UNSIGNED
    url = boto3.client('s3', endpoint_url=os.getenv('AWS_S3_ENDPOINT'), config=s3_config).generate_presigned_url('get_object', ExpiresIn=0, Params={'Bucket': bucket_name, 'Key': obj.key})

    return { "filename": url }
