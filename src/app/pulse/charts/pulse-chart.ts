import { Injectable, Input } from '@angular/core';
import { PulseService } from '../pulse.service';
import Chart = require('chart.js');

Chart.defaults.global.elements.line.cubicInterpolationMode = 'monotone';

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
  @Input() public vmId: string;
  @Input() public permittedIntervals;

  public _selectedAggregations;
  public charts: Array<PulseChart>;

  public shift = 0;

  private _selectedScale;
  private _selectedShift;

  constructor(protected pulse: PulseService) {}

  public get selectedScale() {
    return this._selectedScale;
  }

  public set selectedScale(value: any) {
    this.resetDatasets();
    this._selectedScale = value;
  }

  public get selectedShift() {
    return this._selectedShift;
  }

  public set selectedShift(value) {
    this._selectedShift = value;
  }

  public get selectedAggregations() {
    return this._selectedAggregations;
  }

  public set selectedAggregations(value) {
    this._selectedAggregations = value;
    this.update();
  }

  public previous() {
    this.shift++;
    this.update();
  }

  public next() {
    this.shift--;
    this.update();
  }

  protected updateDatasets(setId: string, datasets: Array<any>) {
    if (!this.charts) {
      return;
    }
    const c = this.charts.find(_ => _.id === setId);
    if (!c) {
      return;
    }

    c.datasets = [];
    setTimeout(() => c.datasets = datasets);
  }

  protected resetDatasets() {
    if (this.charts) {
      this.charts.forEach(c => c.datasets = []);
    }
  }

  public abstract update();
}
