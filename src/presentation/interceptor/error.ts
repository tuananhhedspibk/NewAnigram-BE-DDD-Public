import { DomainError, DomainErrorCode } from '@domain/exception';
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from '@infrastructure/exception';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { UsecaseError, UsecaseErrorCode } from '@usecase/exception';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<FixType>,
  ): Observable<FixType> | Promise<Observable<FixType>> {
    return next.handle().pipe(
      catchError((err) => {
        let responseError;

        if (err instanceof UsecaseError) {
          switch (err.code) {
            case UsecaseErrorCode.BAD_REQUEST:
              responseError = new BadRequestException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
            case UsecaseErrorCode.NOT_FOUND:
              responseError = new NotFoundException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
            case UsecaseErrorCode.INTERNAL_SERVER_ERROR:
            default:
              responseError = new InternalServerErrorException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
          }
        } else if (err instanceof DomainError) {
          switch (err.code) {
            case DomainErrorCode.BAD_REQUEST:
              responseError = new BadRequestException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
            case DomainErrorCode.NOT_FOUND:
              responseError = new NotFoundException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
            case DomainErrorCode.INTERNAL_SERVER_ERROR:
            default:
              responseError = new InternalServerErrorException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
          }
        } else if (err instanceof InfrastructureError) {
          switch (err.code) {
            case InfrastructureErrorCode.BAD_REQUEST:
              responseError = new BadRequestException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
            case InfrastructureErrorCode.NOT_FOUND:
              responseError = new NotFoundException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
            case InfrastructureErrorCode.INTERNAL_SERVER_ERROR:
            default:
              responseError = new InternalServerErrorException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
          }
        } else {
          responseError = new InternalServerErrorException(
            err.message || 'Internal Server Error',
          );
        }

        return throwError(() => responseError);
      }),
    );
  }
}