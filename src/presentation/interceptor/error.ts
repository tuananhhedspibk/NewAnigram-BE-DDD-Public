import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<FixType>,
  ): Observable<FixType> | Promise<Observable<FixType>> {
    return next.handle().pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
