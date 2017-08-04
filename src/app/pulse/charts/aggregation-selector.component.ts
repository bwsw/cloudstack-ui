import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MdOptionSelectionChange, MdSelectChange } from '@angular/material';

@Component({
  selector: 'cs-aggregation-selector',
  templateUrl: 'aggregation-selector.component.html'
})
export class AggregationSelectorComponent {
  @Input() permittedIntervals: any;
  @Output() scaleChange = new EventEmitter();
  @Output() aggregationsChange = new EventEmitter<MdOptionSelectionChange>();
  @Output() shiftChange = new EventEmitter<string>();
  @Output() shiftReset = new EventEmitter();

  @ViewChild('aggregationSelect') aggregationSelectControl: AbstractControl;

  selectedScale: string;
  selectedShift: string;
  selectedAggregations: Array<string>;

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

  public handleScaleChange(change: MdSelectChange) {
    this.aggregationSelectControl.reset();
    this.scale = change.value;
  }

  public handleAggregationsChange(change: MdSelectChange) {
    this.selectedAggregations = change.value;
    this.aggregationsChange.emit(change.value);
  }

  public handleShiftChange(change: MdSelectChange) {
    this.shift = change.value;
    this.shiftChange.emit(change.value);
  }
}
