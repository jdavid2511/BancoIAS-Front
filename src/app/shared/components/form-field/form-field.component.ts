import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  input,
  signal
} from '@angular/core';
import { controlErrorMessage } from '../../forms/control-error-message';
import { FieldControl } from './field-control.directive';

let fieldErrorSequence = 0;

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormField {
  private readonly fieldControl = contentChild(FieldControl);
  private readonly controlMessage = signal<string | null>(null);

  readonly label = input.required<string>();
  readonly errorId = input(`field-error-${++fieldErrorSequence}`);
  readonly message = this.controlMessage.asReadonly();

  constructor() {
    effect((onCleanup) => {
      const control = this.fieldControl()?.control;
      if (!control) {
        this.controlMessage.set(null);
        return;
      }

      const update = () => this.controlMessage.set(controlErrorMessage(control));
      update();

      const subscription = control.events.subscribe(update);
      onCleanup(() => subscription.unsubscribe());
    });

    effect(() => {
      this.fieldControl()?.bindError(this.message(), this.errorId());
    });
  }
}
