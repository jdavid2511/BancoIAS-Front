import { AbstractControl, ValidationErrors } from '@angular/forms';

export function controlErrorMessage(control: AbstractControl): string | null {
  if (!control.touched || !control.errors) {
    return null;
  }

  return messageFor(control.errors);
}

function messageFor(errors: ValidationErrors): string | null {
  if (errors['required']) {
    return 'Este campo es obligatorio.';
  }

  const maxLength = readRequiredLength(errors['maxlength']);
  if (maxLength != null) {
    return `Máximo ${maxLength} caracteres.`;
  }

  const minAmount = readMinValue(errors['min']);
  if (minAmount != null) {
    return `El monto debe ser al menos ${minAmount}.`;
  }

  return null;
}

function readRequiredLength(value: unknown): number | null {
  if (!isRecord(value) || !('requiredLength' in value)) {
    return null;
  }

  const requiredLength = value['requiredLength'];
  return typeof requiredLength === 'number' ? requiredLength : null;
}

function readMinValue(value: unknown): number | null {
  if (!isRecord(value) || !('min' in value)) {
    return null;
  }

  const min = value['min'];
  return typeof min === 'number' ? min : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
