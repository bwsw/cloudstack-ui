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
  @Output() aggregationChange = new EventEmitter<MdOptionSelectionChange>();

  @ViewChild('aggregationSelect') aggregationSelectControl: AbstractControl;

  selectedScale: string;
  selectedAggregations: Array<string>;

  @Input()
  public get scale() {
    return this.selectedScale;
  }

  public set scale(value) {
    this.selectedScale = value;
    this.scaleChange.emit(value);
  }

  public handleScaleChange(change: MdSelectChange) {
    this.aggregationSelectControl.reset();
    this.scale = change.value;
  }

  public handleAggregationChange(change: MdOptionSelectionChange) {
    this.aggregationChange.emit(change);
  }
}
