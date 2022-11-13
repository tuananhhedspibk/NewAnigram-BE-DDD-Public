import {
  PresentationError,
  PresentationErrorCode,
  PresentationErrorDetailCode,
} from '@presentation/exception';

export const uploadImageFilter = (
  req: FixType,
  file: Express.Multer.File,
  callback: FixType,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new PresentationError({
        code: PresentationErrorCode.BAD_REQUEST,
        message: 'Invalid file type (image: jpg, jpeg, png, gif) only',
        info: {
          errorCode: PresentationErrorDetailCode.INVALID_FILE_TYPE,
        },
      }),
      false,
    );
  }
  callback(null, true);
};
