import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { concat, interval, Subscription } from 'rxjs';
import { finalize, repeat, switchMap, take } from 'rxjs/operators';
import { VirtualMachine } from '../../..';
import { HttpAccessHelperService } from './http-access-helper.service';
import { VmReachability } from './vm-reachability.enum';

export const POLL_PERIOD = 5000;

@Component({
  selector: 'cs-vm-http-access-link',
  templateUrl: './vm-http-access-link.component.html',
  styleUrls: ['./vm-http-access-link.component.scss'],
})
export class VmHttpAccessLinkComponent implements OnInit, OnDestroy {
  @Input() vm: VirtualMachine;

  readonly Reachability = VmReachability;

  get reachabilityState(): VmReachability {
    return this._reachabilityState;
  }
  private _reachabilityState = VmReachability.Unknown;

  get checkingStatus(): boolean {
    return this._checkingStatus;
  }
  private _checkingStatus = false;

  private reachibilityPollingSubscription = Subscription.EMPTY;

  constructor(private reachabilityService: HttpAccessHelperService) {}

  ngOnInit() {
    if (this.vm == null) {
      throw new Error('VM is missing');
    }

    this.reachibilityPollingSubscription = this.createPollingObservable().subscribe(
      reachability => {
        this._reachabilityState = reachability;
        if (this.shouldStopPolling()) {
          this.reachibilityPollingSubscription.unsubscribe();
        }
      },
    );
  }

  ngOnDestroy() {
    this.reachibilityPollingSubscription.unsubscribe();
  }

  private createPollingObservable() {
    const firstRequest$ = this.rechabilityRequest();
    const polling$ = interval(POLL_PERIOD).pipe(
      take(1),
      switchMap(() => this.rechabilityRequest()),
      repeat(),
    );

    return concat(firstRequest$, polling$);
  }

  private rechabilityRequest() {
    this._checkingStatus = true;
    return this.reachabilityService
      .getReachibility(this.vm)
      .pipe(finalize(() => (this._checkingStatus = false)));
  }

  private shouldStopPolling() {
    return (
      this._reachabilityState === VmReachability.Reachable ||
      this._reachabilityState === VmReachability.ServiceUnresponsive
    );
  }
}
