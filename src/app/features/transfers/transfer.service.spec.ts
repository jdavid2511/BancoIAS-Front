import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { TransferResponse } from './components/transfer-result/transfer-response.types';
import { CREATE_NOT_FOUND_MESSAGE, RECENT_TRANSFERS_LIMIT } from './constants/transfer.constants';
import { TransferRequest } from './utils/create-transfer-form.types';
import { TransferService } from './transfer.service';

describe('TransferService', () => {
  let service: TransferService;
  let http: HttpTestingController;

  const request: TransferRequest = {
    requestReference: 'pago-1',
    sourceAccountId: 'CTA-1001',
    destinationAccountId: 'CTA-2001',
    amount: 150000
  };

  const transfer: TransferResponse = {
    ...request,
    status: 'AUTHORIZED',
    reason: null,
    processedAt: '2026-10-08T12:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TransferService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('devuelve la transferencia al crear y consultar', () => {
    let created: TransferResponse | undefined;
    service.create(request).subscribe((result) => {
      created = result;
    });
    const create = http.expectOne(`${environment.apiUrl}/transfers`);
    expect(create.request.method).toBe('POST');
    create.flush({ success: true, data: transfer, error: null });
    expect(created).toEqual(transfer);

    let found: TransferResponse | undefined;
    service.findByReference('pago/1').subscribe((result) => {
      found = result;
    });
    const lookup = http.expectOne(`${environment.apiUrl}/transfers/pago%2F1`);
    expect(lookup.request.method).toBe('GET');
    lookup.flush({ success: true, data: transfer, error: null });
    expect(found).toEqual(transfer);
  });

  it('acepta el listado como arreglo o como sobre de API', () => {
    let listed: TransferResponse[] | undefined;
    service.recent().subscribe((result) => {
      listed = result;
    });
    http
      .expectOne(`${environment.apiUrl}/transfers?limit=${RECENT_TRANSFERS_LIMIT}`)
      .flush([transfer]);
    expect(listed).toEqual([transfer]);

    service.recent().subscribe((result) => {
      listed = result;
    });
    http
      .expectOne(`${environment.apiUrl}/transfers?limit=${RECENT_TRANSFERS_LIMIT}`)
      .flush({ success: true, data: [transfer], error: null });
    expect(listed).toEqual([transfer]);
  });

  it('convierte un sobre fallido en un error amigable', () => {
    let message = '';
    service.create(request).subscribe({
      error: (error: Error) => {
        message = error.message;
      }
    });
    http.expectOne(`${environment.apiUrl}/transfers`).flush(
      { success: false, data: null, error: { code: 'X', message: 'Saldo insuficiente' } },
      { status: 200, statusText: 'OK' }
    );
    expect(message).toBe('Saldo insuficiente');
  });

  it('convierte un 404 HTTP en un mensaje amigable', () => {
    let message = '';
    service.create(request).subscribe({
      error: (error: Error) => {
        message = error.message;
      }
    });
    http.expectOne(`${environment.apiUrl}/transfers`).flush(
      { success: false, data: null, error: null },
      { status: 404, statusText: 'Not Found' }
    );
    expect(message).toBe(CREATE_NOT_FOUND_MESSAGE);
  });
});
