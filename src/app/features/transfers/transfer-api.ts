import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { apiErrorMessage, readHttpErrorMessage } from '../../core/http/http-error-message';
import { ApiEnvelope } from '../../core/http/api-envelope.types';

export function unwrapTransfer<T>(
  source$: Observable<ApiEnvelope<T>>,
  fallback: string
): Observable<T> {
  return source$.pipe(
    map((envelope) => readEnvelope(envelope, fallback)),
    catchError((error: unknown) => toFriendlyError(error, fallback))
  );
}

export function unwrapTransferList<T>(
  source$: Observable<ApiEnvelope<T[]> | T[]>,
  fallback: string
): Observable<T[]> {
  return source$.pipe(
    map((body) => (Array.isArray(body) ? body : readEnvelope(body, fallback))),
    catchError((error: unknown) => toFriendlyError(error, fallback))
  );
}

function readEnvelope<T>(envelope: ApiEnvelope<T>, fallback: string): T {
  if (envelope.success && envelope.data != null) {
    return envelope.data;
  }

  throw new Error(apiErrorMessage(envelope.error, fallback));
}

function toFriendlyError(error: unknown, fallback: string): Observable<never> {
  if (error instanceof HttpErrorResponse) {
    return throwError(() => new Error(readHttpErrorMessage(error, fallback)));
  }

  if (error instanceof Error) {
    return throwError(() => error);
  }

  return throwError(() => new Error(readHttpErrorMessage(error, fallback)));
}
