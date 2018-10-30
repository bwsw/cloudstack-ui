import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnChanges,
} from '@angular/core';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { default as ResizeObserver } from 'resize-observer-polyfill';

@Component({
  selector: 'cs-vm-logs',
  templateUrl: 'vm-logs.component.html',
  styleUrls: ['vm-logs.component.scss'],
})
export class VmLogsComponent implements AfterViewInit, OnChanges {
  public updateFabPosition = new BehaviorSubject<void>(null);
  public resizeObserver = new ResizeObserver(() => {
    this.updateFabPosition.next(null);
  });
  public fabPosition$ = merge(
    this.updateFabPosition.asObservable(),
    fromEvent(document, 'scroll', {
      capture: true,
    }).pipe(filter(() => this.newestFirst)),
  ).pipe(
    map(() => {
      if (!this.newestFirst) {
        return null;
      }

      const rect = this.tableContainer.nativeElement.getBoundingClientRect();
      const top = rect.top > 0 ? rect.top : 0;
      return top + 32;
    }),
  );

  @Input()
  public isAutoUpdateEnabled: boolean;
  @Input()
  public selectedVmId: string;
  @Input()
  public newestFirst: boolean;
  @Output()
  public autoUpdateStarted = new EventEmitter<void>();
  @Output()
  public autoUpdateStopped = new EventEmitter<void>();
  @ViewChild('tableContainer')
  private tableContainer: ElementRef<HTMLDivElement>;
  @ViewChild('filterContainer')
  private filterContainer: ElementRef<HTMLDivElement>;

  public ngAfterViewInit() {
    this.resizeObserver.observe(this.filterContainer.nativeElement);
  }

  public ngOnChanges() {
    this.updateFabPosition.next(null);
  }
}
