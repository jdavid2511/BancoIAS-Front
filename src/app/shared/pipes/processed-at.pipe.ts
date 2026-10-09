import { Pipe, PipeTransform } from '@angular/core';
import { TRANSFER_LOCALE } from '../../features/transfers/constants/transfer.constants';

const processedAtFormatter = new Intl.DateTimeFormat(TRANSFER_LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short'
});

@Pipe({ name: 'processedAt' })
export class ProcessedAtPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return processedAtFormatter.format(parsed);
  }
}
