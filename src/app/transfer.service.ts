import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiEnvelope, TransferRequest, TransferResponse } from './models';

@Injectable({ providedIn: 'root' })
export class TransferService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  create(request: TransferRequest): Observable<ApiEnvelope<TransferResponse>> {
    return this.http.post<ApiEnvelope<TransferResponse>>(`${this.baseUrl}/transfers`, request);
  }

  findByReference(requestReference: string): Observable<ApiEnvelope<TransferResponse>> {
    return this.http.get<ApiEnvelope<TransferResponse>>(
      `${this.baseUrl}/transfers/${encodeURIComponent(requestReference)}`
    );
  }

  recent(limit = 10): Observable<TransferResponse[]> {
    return this.http.get<TransferResponse[]>(`${this.baseUrl}/transfers`, {
      params: { limit }
    });
  }
}