/* eslint-disable @typescript-eslint/no-unused-vars */

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
import {
  PresentationError,
  PresentationErrorCode,
} from '@presentation/exception';
import { UsecaseError, UsecaseErrorCode } from '@usecase/exception';
import { ViewError, ViewErrorCode } from '@view/exception';
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
        } else if (err instanceof PresentationError) {
          switch (err.code) {
            case PresentationErrorCode.BAD_REQUEST:
              responseError = new BadRequestException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
            case PresentationErrorCode.NOT_FOUND:
              responseError = new NotFoundException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
            case PresentationErrorCode.INTERNAL_SERVER_ERROR:
            default:
              responseError = new InternalServerErrorException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
          }
        } else if (err instanceof ViewError) {
          switch (err.code) {
            case ViewErrorCode.BAD_REQUEST:
              responseError = new BadRequestException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
            case ViewErrorCode.NOT_FOUND:
              responseError = new NotFoundException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
            case ViewErrorCode.INTERNAL_SERVER_ERROR:
            default:
              responseError = new InternalServerErrorException(
                err.message,
                JSON.stringify(err.info),
              );
              break;
          }
        } else {
          switch (err.response.error) {
            case 'Payload Too Large':
              responseError = new BadRequestException(
                err.response.error,
                JSON.stringify(err.response),
              );
              break;
            default:
              responseError = new InternalServerErrorException(
                err.message || 'Internal Server Error',
              );
              break;
          }
        }

        return throwError(() => responseError);
      }),
    );
  }
}
