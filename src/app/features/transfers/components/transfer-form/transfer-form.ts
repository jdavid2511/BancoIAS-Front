import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldControl } from '../../../../shared/components/form-field/field-control.directive';
import { FormField } from '../../../../shared/components/form-field/form-field.component';
import {
  ACCOUNT_ID_MAX_LENGTH,
  MIN_TRANSFER_AMOUNT,
  REQUEST_REFERENCE_MAX_LENGTH
} from '../../constants/transfer.constants';
import { TransferFormGroup } from '../../utils/create-transfer-form.types';

@Component({
  selector: 'app-transfer-form',
  imports: [ReactiveFormsModule, FormField, FieldControl],
  templateUrl: './transfer-form.html',
  styleUrl: './transfer-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferForm {
  readonly form = input.required<TransferFormGroup>();
  readonly submitting = input(false);
  readonly transferSubmitted = output<void>();

  readonly referenceMaxLength = REQUEST_REFERENCE_MAX_LENGTH;
  readonly accountMaxLength = ACCOUNT_ID_MAX_LENGTH;
  readonly minAmount = MIN_TRANSFER_AMOUNT;

  private readonly submitAttempted = signal(false);

  submit(): void {
    if (this.submitting()) {
      return;
    }

    this.submitAttempted.set(true);
    this.form().markAllAsTouched();
    if (this.form().invalid) {
      return;
    }
    this.transferSubmitted.emit();
  }

  sameAccountMessage(): string | null {
    const form = this.form();
    const accountsTouched =
      form.controls.sourceAccountId.touched && form.controls.destinationAccountId.touched;

    if (!form.hasError('sameAccount') || (!this.submitAttempted() && !accountsTouched)) {
      return null;
    }

    return 'La cuenta origen y la cuenta destino deben ser distintas.';
  }
}
