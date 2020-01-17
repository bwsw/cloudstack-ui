import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatTabChangeEvent } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Dictionary } from '@ngrx/entity';
import * as moment from 'moment';
import {
  PulseChartComponent,
  PulseCpuRamChartComponent,
  PulseDiskChartComponent,
  PulseNetworkChartComponent,
} from '../charts';
import { Intervals, IntervalsResp, PulseService } from '../pulse.service';
import { PulseParamsPersistence } from './pulse-params-persistence';

const debounce = require('lodash/debounce');

const enum TabIndex {
  CpuRam,
  Network,
  Disk,
}

@Component({
  selector: 'cs-vm-pulse',
  templateUrl: './vm-pulse.component.html',
  styleUrls: ['./vm-pulse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VmPulseComponent implements OnInit, OnDestroy {
  @ViewChild(PulseCpuRamChartComponent)
  cpuRamChart: PulseCpuRamChartComponent;
  @ViewChild(PulseNetworkChartComponent)
  networkChart: PulseNetworkChartComponent;
  @ViewChild(PulseDiskChartComponent)
  diskChart: PulseDiskChartComponent;

  public tabIndex = 0;
  public permittedIntervals: Intervals;

  public pulseTranslations: {
    LABELS: Dictionary<string>;
    INTERVALS: {
      RANGES: Dictionary<string>;
      AGGREGATIONS: Dictionary<string>;
      SHIFTS: Dictionary<string>;
    };
  };
  public unitTranslations: Dictionary<string>;

  // tslint:disable:variable-name
  private _selectedScale;
  private _selectedAggregations = [];
  private _selectedShift;
  private _shiftAmount = 0;
  // tslint:enable:variable-name

  private updateInterval;

  constructor(
    @Inject(MAT_DIALOG_DATA) public vmId: string,
    private pulse: PulseService,
    private translateService: TranslateService,
    private persistence: PulseParamsPersistence,
  ) {
    this.updateChart = debounce(this.updateChart, 300);
  }

  public ngOnInit() {
    moment.locale(this.translateService.currentLang);
    this.pulse.getPermittedIntervals().subscribe((intervals: IntervalsResp) => {
      this.permittedIntervals = {
        shifts: intervals.shifts,
        scales: intervals.scales.map(scale => Object.values(scale)[0]),
      };
      this.scheduleAutoRefresh();
      this.initParameters();
    });

    this.translateService
      .get('PULSE')
      .subscribe(translations => (this.pulseTranslations = translations));
    this.translateService
      .get('UNITS')
      .subscribe(translations => (this.unitTranslations = translations));
  }

  public ngOnDestroy() {
    clearInterval(this.updateInterval);
  }

  public get selectedScale() {
    return this._selectedScale;
  }

  public set selectedScale(value: any) {
    this.resetDatasets();
    this._selectedScale = value;

    if (this.selectedScale) {
      this.persistParams();

      const available = this.selectedAggregations.reduce((res, val) => {
        return this._selectedScale.aggregations.find(a => a === val) ? res.concat(val) : res;
      }, []);

      this.selectedAggregations = !!available.length
        ? available
        : [this._selectedScale.aggregations[0]];
    }
  }

  public get selectedAggregations() {
    return this._selectedAggregations;
  }

  public set selectedAggregations(value) {
    this._selectedAggregations = value;

    this.persistParams();

    if (Array.isArray(value) && !value.length) {
      this.resetDatasets();
    } else if (value) {
      this.updateChart();
    }
  }

  public get selectedShift() {
    return this._selectedShift;
  }

  public set selectedShift(value) {
    this._selectedShift = value;
    this.persistParams();

    // TODO
    if (this.shouldUpdate()) {
      this.updateChart();
    }
  }

  public get shiftAmount() {
    return this._shiftAmount;
  }

  public set shiftAmount(value) {
    this._shiftAmount = value;
    this.persistParams();

    if (this.shouldUpdate()) {
      this.updateChart(this.tabIndex);
    }
  }

  public refresh(forceUpdate = true) {
    if (this._selectedAggregations && this._selectedScale) {
      clearInterval(this.updateInterval);
      this.updateChart(this.tabIndex, forceUpdate);
    }
    this.scheduleAutoRefresh();
  }

  public handleSelectChange(change: MatTabChangeEvent) {
    if (this.selectedAggregations) {
      this.updateChart(change.index);
    }
  }

  public handlePrevious() {
    this.shiftAmount += 1;
    this.updateChart();
  }

  public handleNext() {
    this.shiftAmount -= 1;
    this.updateChart();
  }

  private shouldUpdate(): boolean {
    return this._selectedAggregations && this._selectedScale && this._shiftAmount != null;
  }

  private updateChart(index: number = this.tabIndex, forceUpdate = false) {
    const chart = this.getChart(index);
    if (chart) {
      chart.update(
        {
          vmId: this.vmId,
          selectedAggregations: this.selectedAggregations,
          selectedScale: this.selectedScale,
          selectedShift: this.selectedShift,
          shiftAmount: this.shiftAmount,
        },
        forceUpdate,
      );
    }
  }

  private resetDatasets() {
    for (let i = TabIndex.CpuRam; i < TabIndex.Disk; i += 1) {
      const chart = this.getChart(i);
      if (chart) {
        chart.resetDatasets();
      }
    }
  }

  private scheduleAutoRefresh() {
    this.updateInterval = setTimeout(() => this.refresh(), 60000);
  }

  private getChart(index = this.tabIndex): PulseChartComponent | undefined {
    switch (index) {
      case TabIndex.CpuRam:
        return this.cpuRamChart;
      case TabIndex.Network:
        return this.networkChart;
      case TabIndex.Disk:
        return this.diskChart;
      default:
        return;
    }
  }

  private initParameters() {
    const persistedParams = this.persistence.readParams();

    this._selectedScale = this.getScale(persistedParams.scaleRange);
    this._selectedAggregations = this.getAggregations(persistedParams.aggregations);
    this._selectedShift = this.getShift(persistedParams.shift);
    this._shiftAmount = persistedParams.shiftAmount || 0;

    this.refresh();
  }

  private getScale(scaleRange: string | undefined): { range: string; aggregations: string[] } {
    return !!scaleRange
      ? this.permittedIntervals.scales.find(_ => _.range === scaleRange)
      : this.permittedIntervals.scales[0];
  }

  private getAggregations(aggregations: string[] | undefined): string[] {
    if (aggregations) {
      return aggregations;
    }
    if (this._selectedScale && !!this._selectedScale.aggregations.length) {
      return [this._selectedScale.aggregations[0]];
    }
    return [];
  }

  private getShift(shift: string | undefined): string {
    return !!shift ? shift : this.permittedIntervals.shifts[0];
  }

  private persistParams() {
    this.persistence.writeParams({
      shiftAmount: this._shiftAmount,
      shift: this._selectedShift,
      scaleRange: this._selectedScale.range,
      aggregations: this._selectedAggregations,
    });
  }
}
