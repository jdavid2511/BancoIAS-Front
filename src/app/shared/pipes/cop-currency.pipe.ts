import { Pipe, PipeTransform } from '@angular/core';
import {
  TRANSFER_CURRENCY,
  TRANSFER_FRACTION_DIGITS,
  TRANSFER_LOCALE
} from '../../features/transfers/constants/transfer.constants';

const copCurrencyFormatter = new Intl.NumberFormat(TRANSFER_LOCALE, {
  style: 'currency',
  currency: TRANSFER_CURRENCY,
  minimumFractionDigits: TRANSFER_FRACTION_DIGITS,
  maximumFractionDigits: TRANSFER_FRACTION_DIGITS
});

@Pipe({ name: 'copCurrency' })
export class CopCurrencyPipe implements PipeTransform {
  transform(amount: number | null | undefined): string {
    if (amount == null) {
      return '';
    }

    return copCurrencyFormatter.format(amount);
  }
}
