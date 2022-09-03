import { Connection, createConnection } from 'typeorm';
import SigninUsecase, { SigninUsecaseInput } from '.';
import { AuthenticateRepository } from '@infrastructure/repositories/authenticate';
import { UserRepository } from '@infrastructure/repositories/user';
import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';

describe('Signin Usecase Testing', () => {
  let input: SigninUsecaseInput;
  let usecase: SigninUsecase;
  let connection: Connection;

  beforeAll(async () => {
    usecase = new SigninUsecase(
      new UserRepository(),
      new AuthenticateRepository(),
    );
    connection = await createConnection();
  });
  afterAll(async () => {
    connection.close();
  });
  describe('Abnormal case', () => {
    let error;

    describe('Not provide email when calling', () => {
      beforeAll(async () => {
        input = { email: '', password: '123456' };

        try {
          await usecase.execute(input);
        } catch (e) {
          error = e;
        }
      });

      it('"Must specify email and password" error message will be returned', () => {
        expect(error.message).toEqual('Must specify email and password');
      });
      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });
      it('Error detail code is MUST_SPECIFY_EMAIL_AND_PASSWORD', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.MUST_SPECIFY_EMAIL_AND_PASSWORD,
        );
      });
    });

    describe('Not provide password when calling', () => {
      beforeAll(async () => {
        input = { email: 'test@mail.com', password: '' };

        try {
          await usecase.execute(input);
        } catch (e) {
          error = e;
        }
      });

      it('"Must specify email and password" error message will be returned', () => {
        expect(error.message).toEqual('Must specify email and password');
      });
      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });
      it('Error detail code is MUST_SPECIFY_EMAIL_AND_PASSWORD', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.MUST_SPECIFY_EMAIL_AND_PASSWORD,
        );
      });
    });

    describe('Not provide email and password when calling', () => {
      beforeAll(async () => {
        input = { email: '', password: '' };

        try {
          await usecase.execute(input);
        } catch (e) {
          error = e;
        }
      });

      it('"Must specify email and password" error message will be returned', () => {
        expect(error.message).toEqual('Must specify email and password');
      });
      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });
      it('Error detail code is MUST_SPECIFY_EMAIL_AND_PASSWORD', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.MUST_SPECIFY_EMAIL_AND_PASSWORD,
        );
      });
    });
  });
});
