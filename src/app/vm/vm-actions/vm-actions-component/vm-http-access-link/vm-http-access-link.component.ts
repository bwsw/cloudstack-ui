import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { VirtualMachine } from '../../..';
import { VmReachability } from './vm-reachability.enum';
import { VmReachabilityService } from './vm-reachability.service';

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

  constructor(private reachabilityService: VmReachabilityService) {}

  ngOnInit() {
    if (this.vm == null) {
      throw new Error('VM is missing');
    }

    this.reachibilityPollingSubscription = this.pollRequest().subscribe(reachability => {
      this._reachabilityState = reachability;
      if (this.shouldStopPolling()) {
        this.reachibilityPollingSubscription.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.reachibilityPollingSubscription.unsubscribe();
  }

  private pollRequest() {
    return timer(0, POLL_PERIOD).pipe(
      tap(() => (this._checkingStatus = true)),
      switchMap(() =>
        this.reachabilityService
          .getReachibility(this.vm)
          .pipe(finalize(() => (this._checkingStatus = false))),
      ),
    );
  }

  private shouldStopPolling() {
    return (
      this._reachabilityState === VmReachability.Reachable ||
      this._reachabilityState === VmReachability.ServiceUnresponsive
    );
  }
}
