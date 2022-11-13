import * as AwsSDK from 'aws-sdk';

import {
  awsConfig,
  imageServerURL,
  s3BucketName,
  testImageServerURL,
} from '@config/aws';

AwsSDK.config.update(awsConfig);

const s3 = new AwsSDK.S3();

export const generateS3GetURL = (key: string): string => {
  if (process.env.NODE_ENV === 'test') {
    return `{${testImageServerURL}/${key}}`;
  }
  return `${imageServerURL}/${key}`;
};

export const uploadImageToS3Bucket = async (
  key: string,
  data: File,
): Promise<void> => {
  await s3
    .upload({
      Bucket: s3BucketName,
      Key: key,
      Body: data,
    })
    .promise();

  return;
};
