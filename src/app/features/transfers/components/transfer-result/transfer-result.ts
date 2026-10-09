import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';
import { ProcessedAtPipe } from '../../../../shared/pipes/processed-at.pipe';
import { RejectionReasonPipe } from '../../../../shared/pipes/rejection-reason.pipe';
import { TransferResponse } from './transfer-response.types';
import { StatusBadge } from '../../../../shared/components/transfer-status-badge/status-badge.component';

@Component({
  selector: 'app-transfer-result',
  imports: [CopCurrencyPipe, ProcessedAtPipe, RejectionReasonPipe, StatusBadge],
  templateUrl: './transfer-result.html',
  styleUrl: './transfer-result.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferResult {
  readonly transfer = input<TransferResponse | null>(null);
  readonly errorMessage = input<string | null>(null);
}
