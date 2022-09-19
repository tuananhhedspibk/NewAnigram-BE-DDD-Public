import { ErrorCode, ERROR_MESSAGE } from '@constants/error';
import { AuthenticateRepository } from '@infrastructure/repository/authenticate';
import { ApiResultCode } from '@usecase/dto/api-result';

import CheckPasswordUsecase, {
  CheckPasswordUsecaseInput,
  CheckPasswordUsecaseOutput,
} from '.';

describe('CheckPassword Usecase testing', () => {
  const userEmail = 'test@mail.com';

  let input: CheckPasswordUsecaseInput;
  let output: CheckPasswordUsecaseOutput;
  let usecase: CheckPasswordUsecase;

  beforeAll(async () => {
    usecase = new CheckPasswordUsecase(new AuthenticateRepository());
  });

  describe('Valid password testing', () => {
    beforeAll(async () => {
      input = { password: 'validpass' };

      jest
        .spyOn(AuthenticateRepository.prototype, 'validate')
        .mockResolvedValue(true);

      output = await usecase.execute(input, userEmail);
    });

    it('Api result code is OK', () => {
      expect(output.result.code).toEqual(ApiResultCode.OK);
    });
    it('Api data valid is true', () => {
      expect(output.data.valid).toEqual(true);
    });
  });

  describe('Invalid password testing', () => {
    beforeAll(async () => {
      input = { password: 'invalidpass' };

      jest
        .spyOn(AuthenticateRepository.prototype, 'validate')
        .mockResolvedValue(false);

      output = await usecase.execute(input, userEmail);
    });

    it('Api result code is OK', () => {
      expect(output.result.code).toEqual(ApiResultCode.ERROR);
    });
    it('Api error list length is 1', () => {
      expect(output.result.errorList.length).toEqual(1);
    });
    it("Api error lists item 's code is INVALID_PASSWORD_ERR", () => {
      expect(output.result.errorList[0].code).toEqual(
        ErrorCode.INVALID_PASSWORD_ERR,
      );
    });
    it("Api error lists item 's message is 'Invalid password'", () => {
      expect(output.result.errorList[0].message).toEqual(
        ERROR_MESSAGE[ErrorCode.INVALID_PASSWORD_ERR],
      );
    });
    it('Api data valid is false', () => {
      expect(output.data.valid).toEqual(false);
    });
  });
});
