import { FormControl, FormGroup } from '@angular/forms';

export interface TransferRequest {
  requestReference: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
}

export interface TransferFormValue {
  requestReference: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number | null;
}

export type TransferFormGroup = FormGroup<{
  requestReference: FormControl<string>;
  sourceAccountId: FormControl<string>;
  destinationAccountId: FormControl<string>;
  amount: FormControl<number | null>;
}>;
