import { DestroyRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable } from 'rxjs';
import { TransferResponse } from './components/transfer-result/transfer-response.types';
import { UNKNOWN_ERROR_MESSAGE } from './constants/transfer.constants';
import { TransferService } from './transfer.service';
import { TransferRequest } from './utils/create-transfer-form.types';

@Injectable({ providedIn: 'root' })
export class TransfersFacade {
  private readonly transferService = inject(TransferService);
  private readonly destroyRef = inject(DestroyRef);
  private historyRequestId = 0;
  private lookupRequestId = 0;

  readonly submitting = signal(false);
  readonly lookingUp = signal(false);
  readonly loadingHistory = signal(true);
  readonly requestError = signal<string | null>(null);
  readonly historyError = signal<string | null>(null);
  readonly lastResult = signal<TransferResponse | null>(null);
  readonly history = signal<TransferResponse[]>([]);
  readonly lookupOpen = signal(false);
  readonly lookupError = signal<string | null>(null);
  readonly lookupResult = signal<TransferResponse | null>(null);

  constructor() {
    this.loadHistory();
  }

  create(request: TransferRequest): void {
    if (this.submitting()) {
      return;
    }

    this.requestError.set(null);
    this.run(this.transferService.create(request), this.submitting, {
      next: (transfer) => {
        this.lastResult.set(transfer);
        this.requestError.set(null);
        this.loadHistory();
      },
      error: (message) => {
        this.lastResult.set(null);
        this.requestError.set(message);
      }
    });
  }

  openLookup(): void {
    this.lookupError.set(null);
    this.lookupResult.set(null);
    this.lookupOpen.set(true);
  }

  closeLookup(): void {
    this.lookupRequestId += 1;
    this.lookingUp.set(false);
    this.lookupOpen.set(false);
  }

  lookupByReference(requestReference: string): void {
    const requestId = ++this.lookupRequestId;
    this.lookupError.set(null);
    this.lookingUp.set(true);

    this.transferService
      .findByReference(requestReference)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          if (requestId === this.lookupRequestId) {
            this.lookingUp.set(false);
          }
        })
      )
      .subscribe({
        next: (transfer) => {
          if (requestId !== this.lookupRequestId) {
            return;
          }
          this.lookupResult.set(transfer);
          this.lookupError.set(null);
        },
        error: (error: unknown) => {
          if (requestId !== this.lookupRequestId) {
            return;
          }
          this.lookupResult.set(null);
          this.lookupError.set(errorMessage(error));
        }
      });
  }

  showTransfer(transfer: TransferResponse): void {
    this.lastResult.set(transfer);
    this.requestError.set(null);
  }

  loadHistory(): void {
    const requestId = ++this.historyRequestId;
    this.loadingHistory.set(true);
    this.historyError.set(null);

    this.transferService
      .recent()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          if (requestId === this.historyRequestId) {
            this.loadingHistory.set(false);
          }
        })
      )
      .subscribe({
        next: (transfers) => {
          if (requestId === this.historyRequestId) {
            this.history.set(transfers);
          }
        },
        error: (error: unknown) => {
          if (requestId === this.historyRequestId) {
            this.historyError.set(errorMessage(error));
          }
        }
      });
  }

  private run<T>(
    request$: Observable<T>,
    pending: WritableSignal<boolean>,
    handlers: { next: (value: T) => void; error: (message: string) => void }
  ): void {
    pending.set(true);
    request$.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => pending.set(false))).subscribe({
      next: handlers.next,
      error: (error: unknown) => handlers.error(errorMessage(error))
    });
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE;
}
