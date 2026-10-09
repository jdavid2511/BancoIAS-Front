import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEnvelope } from '../../core/http/api-envelope.types';
import { TransferResponse } from './components/transfer-result/transfer-response.types';
import {
  CREATE_NOT_FOUND_MESSAGE,
  HISTORY_NOT_FOUND_MESSAGE,
  RECENT_TRANSFERS_LIMIT,
  TRANSFER_NOT_FOUND_MESSAGE
} from './constants/transfer.constants';
import { unwrapTransfer, unwrapTransferList } from './transfer-api';
import { TransferRequest } from './utils/create-transfer-form.types';

@Injectable({ providedIn: 'root' })
export class TransferService {
  private readonly http = inject(HttpClient);
  private readonly transfersUrl = `${environment.apiUrl}/transfers`;

  create(request: TransferRequest): Observable<TransferResponse> {
    return unwrapTransfer(
      this.http.post<ApiEnvelope<TransferResponse>>(this.transfersUrl, request),
      CREATE_NOT_FOUND_MESSAGE
    );
  }

  findByReference(requestReference: string): Observable<TransferResponse> {
    return unwrapTransfer(
      this.http.get<ApiEnvelope<TransferResponse>>(
        `${this.transfersUrl}/${encodeURIComponent(requestReference)}`
      ),
      TRANSFER_NOT_FOUND_MESSAGE
    );
  }

  recent(limit = RECENT_TRANSFERS_LIMIT): Observable<TransferResponse[]> {
    return unwrapTransferList(
      this.http.get<ApiEnvelope<TransferResponse[]> | TransferResponse[]>(this.transfersUrl, {
        params: { limit }
      }),
      HISTORY_NOT_FOUND_MESSAGE
    );
  }
}
