import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MD_DIALOG_DATA, MdTabChangeEvent } from '@angular/material';
import { PulseCpuRamChartComponent } from '../charts/pulse-cpu-ram-chart/pulse-cpu-ram-chart.component';
import { PulseDiskChartComponent } from '../charts/pulse-disk-chart/pulse-disk-chart.component';
import { PulseNetworkChartComponent } from '../charts/pulse-network-chart/pulse-network-chart.component';
import { PulseService } from '../pulse.service';

const enum TabIndex {
  CpuRam,
  Network,
  Disk
}

@Component({
  selector: 'cs-vm-pulse',
  templateUrl: './vm-pulse.component.html',
  styleUrls: ['./vm-pulse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class VmPulseComponent implements OnInit, OnDestroy {
  @ViewChild(PulseCpuRamChartComponent) cpuRamChart: PulseCpuRamChartComponent;
  @ViewChild(PulseNetworkChartComponent) networkChart: PulseNetworkChartComponent;
  @ViewChild(PulseDiskChartComponent) diskChart: PulseDiskChartComponent;

  public tabIndex = 0;
  public permittedIntervals;

  private _selectedScale;
  private _selectedAggregations;
  private _selectedShift;
  private _shiftAmount = 0;

  private updateInterval;

  constructor(
    @Inject(MD_DIALOG_DATA) public vmId: string,
    private pulse: PulseService
  ) {
  }

  public ngOnInit() {
    this.pulse.getPermittedIntervals().subscribe(intervals => {
      intervals.scales = Object.values(intervals.scales);
      this.permittedIntervals = intervals;
      this.scheduleAutoRefresh();
    });
  }

  public ngOnDestroy() {
    clearInterval(this.updateInterval);
  }

  public get selectedScale() {
    return this._selectedScale;
  }

  public set selectedScale(value: any) {
    // this.resetDatasets();
    this._selectedScale = value;
  }

  public get selectedAggregations() {
    return this._selectedAggregations;
  }

  public set selectedAggregations(value) {
    this._selectedAggregations = value;

    this.updateChart();
  }

  public get selectedShift() {
    return this._selectedShift;
  }

  public set selectedShift(value) {
    this._selectedShift = value;
    // TODO
    if (this._selectedAggregations && this._selectedScale && this._shiftAmount) {
      this.updateChart();
    }
  }

  public get shiftAmount() {
    return this._shiftAmount;
  }

  public set shiftAmount(value) {
    this._shiftAmount = value;
    this.updateChart(this.tabIndex);
  }

  public refresh() {
    if (this._selectedAggregations && this._selectedScale) {
      clearInterval(this.updateInterval);
      this.updateChart(this.tabIndex, true);
    }
    this.scheduleAutoRefresh();
  }

  public handleSelectChange(change: MdTabChangeEvent) {
    if (this.selectedAggregations) {
      this.updateChart(change.index);
    }
  }

  public handlePrevious() {
    this.shiftAmount++;
    this.updateChart();
  }

  public handleNext() {
    this.shiftAmount--;
    this.updateChart();
  }

  private updateChart(index: number = this.tabIndex, forceUpdate = false) {
    let chart;
    switch (index) {
      case TabIndex.CpuRam:
        chart = this.cpuRamChart;
        break;
      case TabIndex.Network:
        chart = this.networkChart;
        break;
      case TabIndex.Disk:
        chart = this.diskChart;
        break;
      default:
        return;
    }

    chart.update({
      vmId: this.vmId,
      selectedAggregations: this.selectedAggregations,
      selectedScale: this.selectedScale,
      selectedShift: this.selectedShift,
      shiftAmount: this.shiftAmount
    }, forceUpdate);
  }

  private scheduleAutoRefresh() {
    this.updateInterval = setTimeout(() => this.refresh(), 60000);
  }
}
