import { NestMiddleware } from '@nestjs/common';
import {
  PresentationError,
  PresentationErrorCode,
  PresentationErrorDetailCode,
} from '@presentation/exception';
import { Request, Response, NextFunction } from 'express';
import { AuthenTokenParamsSchema, verifyJWT } from '@utils/encrypt';
import { HTTP_STATUS } from '@constants/http-status';

export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    const [valid, decoded, err] = this.authorize(authToken);

    if (!valid) {
      res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    const user = AuthenTokenParamsSchema.safeParse(decoded);
    if (user.success === false) {
      res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      return;
    }

    req['users'] = user.data;

    next();
  }

  authorize(authToken: string): [boolean, FixType, Error] {
    if (!(authToken.split(' ')[0] === 'Bearer'))
      return [
        false,
        undefined,
        new PresentationError({
          code: PresentationErrorCode.BAD_REQUEST,
          message: 'Unauthorized',
          info: {
            detailCode: PresentationErrorDetailCode.UNAUTHORIZED,
          },
        }),
      ];

    const jwtToken = authToken.split(' ')[1];

    return verifyJWT(jwtToken);
  }
}
