import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';
import { ProcessedAtPipe } from '../../../../shared/pipes/processed-at.pipe';
import { RejectionReasonPipe } from '../../../../shared/pipes/rejection-reason.pipe';
import { TransferResponse } from '../transfer-result/transfer-response.types';
import { StatusBadge } from '../../../../shared/components/transfer-status-badge/status-badge.component';

@Component({
  selector: 'app-transfer-history',
  imports: [CopCurrencyPipe, ProcessedAtPipe, RejectionReasonPipe, StatusBadge],
  templateUrl: './transfer-history.html',
  styleUrl: './transfer-history.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferHistory {
  readonly transfers = input.required<readonly TransferResponse[]>();
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly transferSelected = output<TransferResponse>();

  selectTransfer(transfer: TransferResponse): void {
    this.transferSelected.emit(transfer);
  }
}
