import { Directive, inject, signal } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFieldControl]',
  host: {
    '[attr.aria-invalid]': 'invalid()',
    '[attr.aria-describedby]': 'describedBy()'
  }
})
export class FieldControl {
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  readonly invalid = signal(false);
  readonly describedBy = signal<string | null>(null);

  get control() {
    return this.ngControl?.control ?? null;
  }

  bindError(message: string | null, errorId: string): void {
    this.invalid.set(message !== null);
    this.describedBy.set(message ? errorId : null);
  }
}
