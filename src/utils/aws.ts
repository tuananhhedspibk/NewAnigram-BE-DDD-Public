import axios from 'axios';
import * as AwsSDK from 'aws-sdk';

import {
  awsConfig,
  imageServerURL,
  s3BucketName,
  testImageServerURL,
  testS3BucketName,
} from '@config/aws';

AwsSDK.config.update(awsConfig);

const s3 = new AwsSDK.S3();

export const generateS3GetURL = (key: string): string => {
  if (process.env.NODE_ENV === 'test') {
    return `{${testImageServerURL}/${key}}`;
  }
  return `${imageServerURL}/${key}`;
};

export const generateS3PutURL = async (
  key: string,
  contentType: string,
): Promise<string> => {
  const params = {
    Bucket: process.env.NODE_ENV === 'test' ? testS3BucketName : s3BucketName,
    Key: key,
    ContentType: contentType,
  };

  return s3.getSignedUrlPromise('putObject', params);
};

export const uploadImageToS3Bucket = async (
  url: string,
  data: File,
  options?: FixType,
): Promise<void> => {
  return axios.put(url, data, options);
};
