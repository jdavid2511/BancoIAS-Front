import { TransferStatus } from '../../../../shared/components/transfer-status-badge/transfer-status.types';
import { RejectionReason } from '../../../../shared/pipes/rejection-reason.types';

export interface TransferResponse {
  requestReference: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  status: TransferStatus;
  reason: RejectionReason | null;
  processedAt: string;
}
