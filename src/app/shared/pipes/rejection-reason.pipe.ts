import { Pipe, PipeTransform } from '@angular/core';
import { RejectionReason } from './rejection-reason.types';

const REJECTION_REASON_LABELS = {
  AMOUNT_NOT_POSITIVE: 'El monto debe ser mayor a cero',
  SAME_ACCOUNT: 'La cuenta origen y la cuenta destino son la misma',
  ACCOUNT_NOT_FOUND: 'La cuenta no existe',
  SOURCE_ACCOUNT_BLOCKED: 'La cuenta origen está bloqueada',
  INSUFFICIENT_BALANCE: 'Saldo insuficiente'
} as const satisfies Record<RejectionReason, string>;

@Pipe({ name: 'rejectionReason' })
export class RejectionReasonPipe implements PipeTransform {
  transform(reason: string | null | undefined): string {
    if (!reason) {
      return '—';
    }

    if (isRejectionReason(reason)) {
      return REJECTION_REASON_LABELS[reason];
    }

    return reason;
  }
}

function isRejectionReason(reason: string): reason is RejectionReason {
  return Object.hasOwn(REJECTION_REASON_LABELS, reason);
}
