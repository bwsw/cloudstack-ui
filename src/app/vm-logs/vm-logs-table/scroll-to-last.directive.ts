import { Directive, Input, AfterViewInit, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { VmLogsTableComponent } from './vm-logs-table.component';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[csScrollToLast]',
})
export class ScrollToLastDirective implements AfterViewInit, OnDestroy {
  private shouldScrollToLast: boolean;

  @Input()
  set csScrollToLast(value: boolean) {
    this.shouldScrollToLast = value;
  }

  private focusLastRowSubscription: Subscription;

  constructor(private host: VmLogsTableComponent) {}

  public ngAfterViewInit() {
    this.focusLastRowSubscription = this.host.rows.changes.subscribe(
      (rows: QueryList<ElementRef>) => {
        if (rows.last && this.shouldScrollToLast) {
          rows.last.nativeElement.scrollIntoView();
        }
      },
    );
  }

  public ngOnDestroy() {
    if (this.focusLastRowSubscription) {
      this.focusLastRowSubscription.unsubscribe();
    }
  }
}
