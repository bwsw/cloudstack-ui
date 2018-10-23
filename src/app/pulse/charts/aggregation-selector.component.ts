import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatOptionSelectionChange, MatSelectChange } from '@angular/material';
import * as debounce from 'lodash/debounce';

@Component({
  selector: 'cs-aggregation-selector',
  templateUrl: 'aggregation-selector.component.html',
  styles: [
    `
      .aggregation-select {
        margin: 30px 10px 20px;
      }

      .shift-input {
        width: 55px;
      }

      .shift-select {
        width: 100px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AggregationSelectorComponent {
  @Input()
  permittedIntervals: any;
  @Output()
  scaleChange = new EventEmitter();
  @Output()
  aggregationsChange = new EventEmitter<MatOptionSelectionChange>();
  @Output()
  refreshHandle = new EventEmitter<any>();
  @Output()
  shiftChange = new EventEmitter<string>();
  @Output()
  shiftAmountChange = new EventEmitter<number>();

  @ViewChild('aggregationSelect')
  aggregationSelectControl: AbstractControl;

  selectedScale: { aggregations: any[] };
  selectedShift: string;
  @Input()
  public shiftAmount: number;
  selectedAggregations: string[];

  constructor() {
    this.emitShiftChange = debounce(this.emitShiftChange, 300);
  }

  @Input()
  public get scale() {
    return this.selectedScale;
  }

  public set scale(value) {
    this.selectedScale = value;
    this.scaleChange.emit(value);
  }

  @Input()
  public get shift() {
    return this.selectedShift;
  }

  public set shift(value) {
    this.selectedShift = value;
  }

  @Input()
  public get aggregations() {
    return this.selectedAggregations;
  }

  public set aggregations(value) {
    this.selectedAggregations = value;
  }

  public handleScaleChange(change: MatSelectChange) {
    this.aggregationSelectControl.reset();
    this.scale = change.value;
  }

  public handleAggregationsChange(change: MatSelectChange) {
    this.selectedAggregations = change.value;
    this.aggregationsChange.emit(change.value);
  }

  public handleShiftChange(change: MatSelectChange) {
    this.shift = change.value;
    this.shiftChange.emit(change.value);
  }

  public handleShiftAmountChange(change) {
    const amount = parseInt(change.target.value, 10);
    this.shiftAmount = amount;
    this.emitShiftChange(amount);
  }

  public handleRefresh() {
    this.refreshHandle.emit();
  }

  private emitShiftChange(amount: number) {
    this.shiftAmountChange.emit(amount);
  }
}
