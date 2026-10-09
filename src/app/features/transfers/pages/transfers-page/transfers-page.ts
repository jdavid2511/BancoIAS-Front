import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Modal } from '../../../../shared/components/modal/modal.component';
import { TransferForm } from '../../components/transfer-form/transfer-form';
import { TransferHistory } from '../../components/transfer-history/transfer-history';
import { TransferLookup } from '../../components/transfer-lookup/transfer-lookup';
import { TransferResult } from '../../components/transfer-result/transfer-result';
import { TransferResponse } from '../../components/transfer-result/transfer-response.types';
import { TransfersFacade } from '../../transfers.facade';
import { createTransferForm, toTransferRequest } from '../../utils/create-transfer-form';

@Component({
  selector: 'app-transfers-page',
  imports: [TransferForm, TransferResult, TransferHistory, Modal, TransferLookup],
  templateUrl: './transfers-page.html',
  styleUrl: './transfers-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransfersPage {
  readonly transfers = inject(TransfersFacade);
  readonly form = createTransferForm(inject(FormBuilder));

  createTransfer(): void {
    if (this.transfers.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.transfers.create(toTransferRequest(this.form.getRawValue()));
  }

  showTransfer(transfer: TransferResponse): void {
    this.transfers.showTransfer(transfer);
    document
      .getElementById('transfer-result')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
