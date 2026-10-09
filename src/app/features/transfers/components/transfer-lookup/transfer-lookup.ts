import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldControl } from '../../../../shared/components/form-field/field-control.directive';
import { FormField } from '../../../../shared/components/form-field/form-field.component';
import { REQUEST_REFERENCE_MAX_LENGTH } from '../../constants/transfer.constants';
import { TransferResponse } from '../transfer-result/transfer-response.types';
import { TransferResult } from '../transfer-result/transfer-result';

@Component({
  selector: 'app-transfer-lookup',
  imports: [ReactiveFormsModule, TransferResult, FormField, FieldControl],
  templateUrl: './transfer-lookup.html',
  styleUrl: './transfer-lookup.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferLookup {
  private readonly referenceInput = viewChild<ElementRef<HTMLInputElement>>('referenceInput');

  readonly searching = input(false);
  readonly transfer = input<TransferResponse | null>(null);
  readonly errorMessage = input<string | null>(null);
  readonly referenceSubmitted = output<string>();
  readonly cancelled = output<void>();

  readonly referenceMaxLength = REQUEST_REFERENCE_MAX_LENGTH;
  readonly reference = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(REQUEST_REFERENCE_MAX_LENGTH)]
  });

  constructor() {
    afterNextRender(() => this.referenceInput()?.nativeElement.focus());
  }

  submit(event: Event): void {
    event.preventDefault();
    if (this.searching()) {
      return;
    }

    const requestReference = this.reference.value.trim();
    if (!requestReference) {
      this.reference.setValue('');
      this.reference.markAsTouched();
      this.reference.setErrors({ required: true });
      return;
    }

    if (this.reference.invalid) {
      this.reference.markAsTouched();
      return;
    }

    this.referenceSubmitted.emit(requestReference);
  }
}
