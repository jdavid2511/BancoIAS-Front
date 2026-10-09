import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output
} from '@angular/core';

let modalSequence = 0;

@Component({
  selector: 'dialog[appModal]',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-labelledby]': 'titleId',
    '(close)': 'onDialogClose()',
    '(click)': 'onBackdropClick($event)'
  }
})
export class Modal {
  private readonly host = inject(ElementRef<HTMLDialogElement>);

  readonly titleId = `modal-title-${++modalSequence}`;
  readonly title = input.required<string>();
  readonly visible = input(false);
  readonly closed = output<void>();

  constructor() {
    effect(() => this.syncDialog(this.visible()));
  }

  requestClose(): void {
    this.closed.emit();
  }

  onDialogClose(): void {
    if (this.visible()) {
      this.closed.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.isClickOnBackdrop(event)) {
      this.requestClose();
    }
  }

  private isClickOnBackdrop(event: MouseEvent): boolean {
    const bounds = this.host.nativeElement.getBoundingClientRect();
    return (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    );
  }

  private syncDialog(visible: boolean): void {
    const dialog = this.host.nativeElement;

    if (!visible) {
      if (dialog.open) {
        dialog.close();
      }
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }
  }
}
