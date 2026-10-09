import { FormBuilder } from '@angular/forms';
import { controlErrorMessage } from '../../../shared/forms/control-error-message';
import { createTransferForm, toTransferRequest } from './create-transfer-form';

describe('create-transfer-form', () => {
  const formBuilder = new FormBuilder();

  it('rechaza campos vacíos y cuentas iguales', () => {
    const form = createTransferForm(formBuilder);

    expect(form.invalid).toBeTrue();

    form.setValue({
      requestReference: 'pago-1',
      sourceAccountId: 'CTA-1001',
      destinationAccountId: 'CTA-1001',
      amount: 150000
    });

    expect(form.hasError('sameAccount')).toBeTrue();
  });

  it('arma la petición cuando el formulario es válido', () => {
    expect(
      toTransferRequest({
        requestReference: ' pago-1 ',
        sourceAccountId: ' CTA-1001 ',
        destinationAccountId: ' CTA-2001 ',
        amount: 150000
      })
    ).toEqual({
      requestReference: 'pago-1',
      sourceAccountId: 'CTA-1001',
      destinationAccountId: 'CTA-2001',
      amount: 150000
    });
  });

  it('muestra el error del campo solo después de tocarlo', () => {
    const form = createTransferForm(formBuilder);
    const amount = form.controls.amount;

    expect(controlErrorMessage(amount)).toBeNull();

    amount.markAsTouched();
    expect(controlErrorMessage(amount)).toBe('Este campo es obligatorio.');
  });
});
