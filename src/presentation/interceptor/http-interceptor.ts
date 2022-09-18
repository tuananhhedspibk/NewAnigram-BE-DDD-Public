import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  requestLogger,
  responseErrorLogger,
  responseLogger,
} from '@presentation/middleware/logger-middleware';
import logger from '@utils/logger';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<FixType>,
  ): Observable<FixType> | Promise<Observable<FixType>> {
    // intercept() method effectively wraps the request/response stream

    const request = context.switchToHttp().getRequest();

    requestLogger(request);

    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      // 200 response
      map((data) => {
        responseLogger({ requestId: request._id, response, data });
        return data;
      }),
      // Error (4XX, 5XX response)
      tap(null, (exception: HttpException | Error) => {
        try {
          responseErrorLogger({ requestId: request._id, exception });
        } catch (e) {
          logger.access_res.error(e);
        }
      }),
    );
  }
}
