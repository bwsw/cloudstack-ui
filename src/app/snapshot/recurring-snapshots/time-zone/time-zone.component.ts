import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TimeZone, TimeZoneService } from './time-zone.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'cs-time-zone',
  templateUrl: 'time-zone.component.html',
  styleUrls: ['time-zone.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeZoneComponent),
      multi: true
    }
  ]
})
export class TimeZoneComponent implements ControlValueAccessor, OnInit {
  public _timeZone: TimeZone;

  readonly query$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly timeZones$: Observable<Array<TimeZone>> = this.timeZoneService.get();
  readonly visibleTimeZones$ = this.timeZones$.combineLatest(this.query$)
    .map(([timeZones, query]) => {
      return timeZones.filter(timeZone => {
        return this
          .timeZoneToString(timeZone)
          .toLowerCase()
          .includes(query && query.toLowerCase());
      });
    });

  constructor(private timeZoneService: TimeZoneService) {}

  public ngOnInit(): void {
    this.timeZones$.subscribe(timeZones => {
      this.timeZone = timeZones[0];
    });
  }

  public propagateChange: any = () => {};

  @Input()
  public get timeZone(): TimeZone {
    return this._timeZone;
  }

  public set timeZone(value) {
    this._timeZone = value;
    this.propagateChange(this.timeZone);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public writeValue(value: any): void {
    if (value) {
      this.timeZone = value;
    }
  }

  public timeZoneToString(timeZone: TimeZone): string {
    return `${timeZone.geo} (${timeZone.zone})`;
  }

  public updateQuery(query: string): void {
    this.query$.next(query);
  }
}
