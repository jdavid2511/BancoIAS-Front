export type TransferStatus = 'AUTHORIZED' | 'REJECTED';

export type RejectionReason =
  | 'AMOUNT_NOT_POSITIVE'
  | 'SAME_ACCOUNT'
  | 'ACCOUNT_NOT_FOUND'
  | 'SOURCE_ACCOUNT_BLOCKED'
  | 'INSUFFICIENT_BALANCE';

export interface TransferRequest {
  requestReference: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
}

export interface TransferResponse {
  requestReference: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  status: TransferStatus;
  reason: RejectionReason | null;
  processedAt: string;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}