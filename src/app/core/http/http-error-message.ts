import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './api-envelope.types';
import {
  CONNECTION_ERROR_MESSAGE,
  RESOURCE_NOT_FOUND_MESSAGE,
  SERVICE_ERROR_MESSAGE,
  UNEXPECTED_ERROR_MESSAGE,
  UNKNOWN_ERROR_MESSAGE
} from '../../features/transfers/constants/transfer.constants';

const CLIENT_ERROR_MESSAGES: Readonly<Record<number, string>> = {
  400: 'Los datos enviados no son válidos. Revíselos e intente de nuevo.',
  401: 'Debe identificarse para continuar.',
  403: 'No tiene permiso para realizar esta operación.',
  408: 'La solicitud tardó demasiado. Intente de nuevo.',
  409: 'Esta petición ya fue registrada.',
  422: 'No se pudo procesar la solicitud con los datos enviados.'
};

export function apiErrorMessage(error: ApiError | null | undefined, fallback: string): string {
  const message = error?.message?.trim();
  return message || fallback;
}

export function readHttpErrorMessage(
  error: unknown,
  notFoundMessage = RESOURCE_NOT_FOUND_MESSAGE
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return UNKNOWN_ERROR_MESSAGE;
  }

  const apiError = readApiError(error.error);
  if (apiError) {
    return apiErrorMessage(apiError, UNKNOWN_ERROR_MESSAGE);
  }

  if (error.status === 0) {
    return CONNECTION_ERROR_MESSAGE;
  }

  if (error.status === 404) {
    return notFoundMessage;
  }

  if (error.status >= 500) {
    return SERVICE_ERROR_MESSAGE;
  }

  return CLIENT_ERROR_MESSAGES[error.status] ?? UNEXPECTED_ERROR_MESSAGE;
}

function readApiError(body: unknown): ApiError | null {
  if (!isRecord(body) || !('error' in body)) {
    return null;
  }

  const error = body['error'];
  if (!isRecord(error) || !('code' in error) || !('message' in error)) {
    return null;
  }

  const code = error['code'];
  const message = error['message'];
  if (typeof code !== 'string' || typeof message !== 'string') {
    return null;
  }

  return { code, message };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
