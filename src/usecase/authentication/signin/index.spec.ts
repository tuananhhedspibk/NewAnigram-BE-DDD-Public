import { Connection, createConnection } from 'typeorm';
import SigninUsecase, { SigninUsecaseInput, SigninUsecaseOutput } from '.';
import { AuthenticateRepository } from '@infrastructure/repository/authenticate';
import { UserRepository } from '@infrastructure/repository/user';
import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';
import { plainToClass } from '@nestjs/class-transformer';
import { UserEntity } from '@domain/entity/user';
import { userEntity, testJWT } from './testData';
import { ApiResultCode } from '@usecase/dto/api-result';

describe('Signin Usecase Testing', () => {
  let input: SigninUsecaseInput;
  let output: SigninUsecaseOutput;
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

  describe('Normal case', () => {
    describe('Email and password match to each other', () => {
      beforeAll(async () => {
        input = { email: 'test@mail.com', password: '123456' };

        jest
          .spyOn(UserRepository.prototype, 'getByEmail')
          .mockResolvedValue(plainToClass(UserEntity, userEntity));
        jest
          .spyOn(AuthenticateRepository.prototype, 'validate')
          .mockResolvedValue(true);
        jest
          .spyOn(AuthenticateRepository.prototype, 'getJWT')
          .mockReturnValue(testJWT);

        output = await usecase.execute(input);
      });

      it('JWT will be returned', () => {
        expect(output.data.jwt).toEqual(testJWT);
      });
      it('Api result code is OK', () => {
        expect(output.result.code).toEqual(ApiResultCode.OK);
      });
    });
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

    describe('Email does not exist', () => {
      beforeAll(async () => {
        input = { email: 'fail-test@mail.com', password: '123456' };

        jest
          .spyOn(UserRepository.prototype, 'getByEmail')
          .mockResolvedValue(null);

        try {
          await usecase.execute(input);
        } catch (e) {
          error = e;
        }
      });

      it('"Email does not exist" error message will be returend', () => {
        expect(error.message).toEqual('Email does not exist');
      });
      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });
      it('Error detail code is EMAIL_DOES_NOT_EXISTS', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.EMAIL_DOES_NOT_EXISTS,
        );
      });
    });

    describe('Email and password do not match to each other', () => {
      beforeAll(async () => {
        input = { email: 'test@mail.com', password: '123456' };

        jest
          .spyOn(UserRepository.prototype, 'getByEmail')
          .mockResolvedValue(plainToClass(UserEntity, userEntity));
        jest
          .spyOn(AuthenticateRepository.prototype, 'validate')
          .mockResolvedValue(false);

        try {
          await usecase.execute(input);
        } catch (e) {
          error = e;
        }
      });

      it('"Invalid email or password" error message will be returend', () => {
        expect(error.message).toEqual('Invalid email or password');
      });
      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });
      it('Error detail code is INVALID_EMAIL_OR_PASSWORD', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.INVALID_EMAIL_OR_PASSWORD,
        );
      });
    });
  });
});
