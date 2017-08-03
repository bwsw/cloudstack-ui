import { Injectable, Input } from '@angular/core';
import { MdOptionSelectionChange } from '@angular/material';
import { PulseService } from '../pulse.service';

export interface PulseChart {
  id: string;

  width?: number;
  height?: number;
  datasets?: Array<any>;
  chartType?: 'line' | 'bar';
  options?: any;
  labels?: Array<any>;
}


export const defaultChartOptions = {
  responsive: true,
  layout: {
    padding: {
      top: 5
    }
  },
  tooltips: {
    intersect: false,
    mode: 'x'
  },
  scales: {
    xAxes: [{
      type: 'time',
      position: 'bottom'
    }],
    yAxes: [{
      ticks: { suggestedMin: 0 }
    }]
  }
};

export const defaultChartConfig = {
  width: 400,
  height: 400,
  datasets: [],
  chartType: 'line',
  options: defaultChartOptions,
  labels: null
};

export function getChart(config: Array<any>) {
  return config.map(_ => {
    const options = Object.assign({}, defaultChartOptions, _.options);
    return Object.assign({}, defaultChartConfig, { ..._, options })
  })
}


@Injectable()
export abstract class PulseChartComponent {
  @Input() public permittedIntervals;

  private _selectedScale;
  public selectedAggregations;
  public selectedShift;

  public charts: Array<PulseChart>;

  constructor(protected pulse: PulseService) {}

  public get selectedScale() {
    return this._selectedScale;
  }

  public set selectedScale(value: any) {
    this.resetDatasets();
    this._selectedScale = value;
  }

  public update(change: MdOptionSelectionChange) {
    if (change.isUserInput) {
      if (change.source.selected) {
        this.updateData(change.source.value);
      } else {
        this.charts.forEach(c => {
          const datasets = c.datasets.filter(
            _ => _.aggregation !== change.source.value
          );
          c.datasets = null;
          setTimeout(() => (c.datasets = datasets));
        });
      }
    }
  }

  protected addDataset(setId: string, dataset: any) {
    if (!this.charts) {
      return;
    }
    const c = this.charts.find(_ => _.id === setId);
    if (!c) {
      return;
    }

    const datasets = Array.isArray(c.datasets)
      ? c.datasets.concat(dataset)
      : [].concat(dataset);

    c.datasets = [];
    setTimeout(() => (c.datasets = datasets));
  }

  protected resetDatasets() {
    if (this.charts) {
      this.charts.forEach(c => c.datasets = []);
    }
  }

  abstract updateData(value: any);
}
