import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TransferStatus } from './transfer-status.types';

@Component({
  selector: 'app-status-badge',
  template: `
    <span
      class="badge"
      [class.authorized]="status() === 'AUTHORIZED'"
      [class.rejected]="status() === 'REJECTED'"
      >{{ status() }}</span
    >
  `,
  styles: `
    .badge {
      display: inline-block;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.4px;
    }

    .authorized {
      background: var(--success-bg);
      color: var(--success-text);
    }

    .rejected {
      background: var(--danger-bg);
      color: var(--rejected-text);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBadge {
  readonly status = input.required<TransferStatus>();
}
