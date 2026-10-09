import { FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import {
  ACCOUNT_ID_MAX_LENGTH,
  MIN_TRANSFER_AMOUNT,
  REQUEST_REFERENCE_MAX_LENGTH
} from '../constants/transfer.constants';
import { TransferFormGroup, TransferFormValue, TransferRequest } from './create-transfer-form.types';

export function createTransferForm(formBuilder: FormBuilder): TransferFormGroup {
  return formBuilder.group(
    {
      requestReference: textControl(formBuilder, REQUEST_REFERENCE_MAX_LENGTH),
      sourceAccountId: textControl(formBuilder, ACCOUNT_ID_MAX_LENGTH),
      destinationAccountId: textControl(formBuilder, ACCOUNT_ID_MAX_LENGTH),
      amount: formBuilder.control<number | null>(null, [
        Validators.required,
        Validators.min(MIN_TRANSFER_AMOUNT)
      ])
    },
    { validators: differentAccountsValidator }
  );
}

export function toTransferRequest(value: TransferFormValue): TransferRequest {
  return {
    requestReference: value.requestReference.trim(),
    sourceAccountId: value.sourceAccountId.trim(),
    destinationAccountId: value.destinationAccountId.trim(),
    amount: value.amount as number
  };
}

function textControl(formBuilder: FormBuilder, maxLength: number): FormControl<string> {
  return formBuilder.nonNullable.control('', [requiredText, Validators.maxLength(maxLength)]);
}

const requiredText: ValidatorFn = (control) => {
  return readText(control.value).length === 0 ? { required: true } : null;
};

const differentAccountsValidator: ValidatorFn = (control) => {
  const sourceAccountId = readText(control.get('sourceAccountId')?.value);
  const destinationAccountId = readText(control.get('destinationAccountId')?.value);

  if (!sourceAccountId || !destinationAccountId || sourceAccountId !== destinationAccountId) {
    return null;
  }

  return { sameAccount: true };
};

function readText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}
