import { HttpErrorResponse } from '@angular/common/http';
import {
  CONNECTION_ERROR_MESSAGE,
  SERVICE_ERROR_MESSAGE,
  TRANSFER_NOT_FOUND_MESSAGE,
  UNKNOWN_ERROR_MESSAGE
} from '../../features/transfers/constants/transfer.constants';
import { apiErrorMessage, readHttpErrorMessage } from './http-error-message';

describe('http-error-message', () => {
  it('usa el mensaje de la API cuando existe', () => {
    expect(apiErrorMessage({ code: 'X', message: 'Saldo insuficiente' }, 'fallback')).toBe(
      'Saldo insuficiente'
    );
  });

  it('muestra un mensaje amigable para 404', () => {
    const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });

    expect(readHttpErrorMessage(error, TRANSFER_NOT_FOUND_MESSAGE)).toBe(
      TRANSFER_NOT_FOUND_MESSAGE
    );
  });

  it('distingue conexión caída y error del servidor', () => {
    expect(readHttpErrorMessage(new HttpErrorResponse({ status: 0 }))).toBe(
      CONNECTION_ERROR_MESSAGE
    );
    expect(readHttpErrorMessage(new HttpErrorResponse({ status: 500 }))).toBe(SERVICE_ERROR_MESSAGE);
    expect(readHttpErrorMessage(new Error('boom'))).toBe(UNKNOWN_ERROR_MESSAGE);
  });
});
