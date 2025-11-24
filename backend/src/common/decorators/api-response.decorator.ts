/**
 * Custom decorator untuk response format yang standar
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, PaginationMeta } from '../interfaces/response.interface';

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof (value as ApiResponse<T>).success === 'boolean'
  );
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (isApiResponse<T>(data)) {
          return data;
        }

        const payload = data;
        const wrappedResponse: ApiResponse<T> = {
          success: true,
          message: 'Success',
          data: payload,
          timestamp: new Date().toISOString(),
        };

        return wrappedResponse;
      }),
    );
  }
}

export const createPaginatedResponse = <T>(
  data: T[],
  meta: PaginationMeta,
  message: string = 'Data retrieved successfully',
): ApiResponse<T[]> => {
  return {
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };
};

export const createSuccessResponse = <T>(
  data: T,
  message: string = 'Operation successful',
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};
