import {HttpErrorResponse} from '@angular/common/http';
import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize} from 'rxjs';
import {TransferService} from './transfer.service';
import {ApiEnvelope, TransferResponse} from './models';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly formBuilder = inject(FormBuilder);
  private readonly transferService = inject(TransferService);

  readonly form = this.formBuilder.nonNullable.group({
    requestReference: ['', [Validators.required, Validators.maxLength(50)]],
    sourceAccountId: ['', [Validators.required, Validators.maxLength(20)]],
    destinationAccountId: ['', [Validators.required, Validators.maxLength(20)]],
    amount: [0 as number, [Validators.required, Validators.min(1)]]
  });

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly lastResult = signal<TransferResponse | null>(null);
  readonly history = signal<TransferResponse[]>([]);
  readonly loadingHistory = signal(false);

  constructor() {
    this.loadRecent();
  }

  createTransfer(): void {
    if (this.form.invalid) {
      this.errorMessage.set('Complete los campos del formulario (monto mayor a 0).');
      this.lastResult.set(null);
      return;
    }
    this.errorMessage.set(null);
    this.submitting.set(true);
    this.transferService
      .create(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (result) => {
          this.lastResult.set(result.data);
          if (!result.success) {
            this.errorMessage.set(result.error?.message ?? 'Error desconocido');
          }
          this.loadRecent();
        },
        error: (err: HttpErrorResponse) => this.handleHttpError(err)
      });
  }

  lookupByReference(ref: string): void {
    if (!ref.trim()) {
      return;
    }
    this.errorMessage.set(null);
    this.transferService.findByReference(ref.trim()).subscribe({
      next: (result) => {
        if (result.success && result.data) {
          this.lastResult.set(result.data);
          this.form.controls.requestReference.setValue(result.data.requestReference);
        } else {
          this.errorMessage.set(result.error?.message ?? 'No encontrada');
        }
      },
      error: (err: HttpErrorResponse) => this.handleHttpError(err)
    });
  }

  loadRecent(): void {
    this.loadingHistory.set(true);
    this.transferService
      .recent(20)
      .pipe(finalize(() => this.loadingHistory.set(false)))
      .subscribe({
        next: (recent) => this.history.set(recent),
        error: (err) => this.errorMessage.set(this.readHttpError(err))
      });
  }

  private handleHttpError(err: HttpErrorResponse): void {
    const body = err.error as ApiEnvelope<TransferResponse> | null;
    this.lastResult.set(null);
    if (body?.error) {
      this.errorMessage.set(`${body.error.code}: ${body.error.message}`);
    } else {
      this.errorMessage.set(this.readHttpError(err));
    }
  }

  private readHttpError(err: HttpErrorResponse): string {
    const body = err.error as ApiEnvelope<TransferResponse> | null;
    if (body?.error) {
      return `${body.error.code}: ${body.error.message}`;
    }
    return err.status === 0
      ? 'No se pudo conectar con el servicio (¿está corriendo en :8080?).'
      : `Error HTTP ${err.status}`;
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  }
}
