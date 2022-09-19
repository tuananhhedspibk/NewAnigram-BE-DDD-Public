import { AuthenticateRepository } from '.';

describe('Authenticate Repository Testing', () => {
  const authenticateRepository = new AuthenticateRepository();

  describe('getJWT testing', () => {
    describe('Normal case', () => {
      let result: string;
      let numberSegments: number;

      beforeAll(() => {
        result = authenticateRepository.getJWT(1, 'test@mail.com');

        numberSegments = result.split('.').length;
      });

      it('Returned JWT is not null or empty string', () => {
        expect(result).not.toBeNull();
        expect(result.length).toBeGreaterThan(0);
      });
      it('Returned JWT has 3 segments those split by dot (.)', () => {
        expect(numberSegments).toEqual(3);
      });
    });
  });
});
