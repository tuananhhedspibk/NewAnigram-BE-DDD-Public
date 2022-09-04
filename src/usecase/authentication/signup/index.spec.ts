import { Connection, createConnection } from 'typeorm';

import { AuthenticateRepository } from '@infrastructure/repositories/authenticate';
import TransactionManager from '@infrastructure/repositories/transaction';
import { UserRepository } from '@infrastructure/repositories/user';
import SignupUsecase, { SignupUsecaseInput, SignupUsecaseOutput } from '.';
import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';
import { DomainErrorCode, DomainErrorDetailCode } from '@domain/exception';
import { testJWT, userEntity } from './testData';
import { plainToClass } from '@nestjs/class-transformer';
import { UserEntity } from '@domain/entities/user';

describe('Signup Usecase Testing', () => {
  let input: SignupUsecaseInput;
  let output: SignupUsecaseOutput;
  let usecase: SignupUsecase;
  let connection: Connection;

  beforeAll(async () => {
    usecase = new SignupUsecase(
      new UserRepository(),
      new AuthenticateRepository(),
      new TransactionManager(),
    );
    connection = await createConnection();
  });
  afterAll(async () => {
    connection.close();
  });

  describe('Normal case', () => {
    describe('Can signup with valid email and password', () => {
      beforeAll(async () => {
        input = { email: 'test@mail.com', password: '123456' };

        jest
          .spyOn(AuthenticateRepository.prototype, 'isEmailBeingUsed')
          .mockResolvedValue(false);
        jest
          .spyOn(AuthenticateRepository.prototype, 'getJWT')
          .mockResolvedValue(testJWT);
        jest
          .spyOn(UserRepository.prototype, 'save')
          .mockResolvedValue(plainToClass(UserEntity, userEntity));

        output = await usecase.execute(input);
      });

      it('JWT will be returned', () => {
        expect(output.jwt).toEqual(testJWT);
      });
    });
  });

  describe('Abnormal case', () => {
    let error;

    describe('Not provide email', () => {
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

    describe('Not provide password', () => {
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

    describe('Not provide email and password', () => {
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

    describe('Provide email that has invalid format', () => {
      beforeAll(async () => {
        input = { email: 'test', password: '123456' };

        try {
          await usecase.execute(input);
        } catch (e) {
          error = e;
        }
      });

      it('"Invalid email format" error message will be returned', () => {
        expect(error.message).toEqual('Invalid email format');
      });
      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(DomainErrorCode.BAD_REQUEST);
      });
      it('Error detail code is INVALID_EMAIL_FORMAT', () => {
        expect(error.info.detailCode).toEqual(
          DomainErrorDetailCode.INVALID_EMAIL_FORMAT,
        );
      });
    });

    describe('Provide existing email', () => {
      beforeAll(async () => {
        input = { email: 'test@mail.com', password: '123456' };

        jest
          .spyOn(AuthenticateRepository.prototype, 'isEmailBeingUsed')
          .mockResolvedValue(true);

        try {
          await usecase.execute(input);
        } catch (e) {
          error = e;
        }
      });

      it('"Email is being used" error message will be returned', () => {
        expect(error.message).toEqual('Email is being used');
      });
      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });
      it('Error detail code is EMAIL_IS_BEING_USED', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.EMAIL_IS_BEING_USED,
        );
      });
    });
  });
});
