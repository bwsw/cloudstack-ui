import { ChangeDetectorRef, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { PulseService } from '../pulse.service';
import chartJs = require('chart.js');

(chartJs.defaults.global.elements.line as any).cubicInterpolationMode = 'monotone';
chartJs.defaults.global.elements.point.radius = 0;
chartJs.defaults.global.elements.point.hitRadius = 5;

export interface PulseChart {
  id: string;

  width?: number;
  height?: number;
  datasets?: any[];
  chartType?: 'line' | 'bar';
  options?: any;
  labels?: any[];
}

export const defaultChartOptions = {
  maintainAspectRatio: false,
  legend: {
    labels: {
      boxWidth: 20,
    },
  },
  layout: {
    padding: {
      left: 80,
      right: 40,
    },
  },
  tooltips: {
    mode: 'x',
    intersect: false,
  },
  hover: {
    mode: 'nearest',
    intersect: false,
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        position: 'bottom',
        time: {
          tooltipFormat: 'llll',
          displayFormats: {
            second: 'LTS',
            minute: 'LT',
            hour: 'LT',
          },
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          autoSkip: false,
          padding: 40,
          mirror: true,
          suggestedMin: 0,
          userCallback(val) {
            if (val % 1 === 0) {
              return val;
            }
          },
        },
      },
    ],
  },
};

export const defaultChartConfig = {
  width: 400,
  height: 400,
  datasets: [],
  chartType: 'line',
  options: defaultChartOptions,
  labels: null,
};

export function getChart(config: any[]) {
  return config.map(_ => {
    const options = { ...defaultChartOptions, ..._.options };
    return { ...defaultChartConfig, ..._, options };
  });
}

@Injectable()
export abstract class PulseChartComponent {
  @Input()
  public translations;
  @Input()
  public charts: PulseChart[];
  @Input()
  public shift: number;
  @Output()
  public previous = new EventEmitter();
  @Output()
  public next = new EventEmitter();

  public loading = false;
  public error = false;

  constructor(protected pulse: PulseService, protected cd: ChangeDetectorRef) {}

  public resetDatasets() {
    if (this.charts) {
      this.charts.forEach(c => (c.datasets = []));
    }
    this.cd.markForCheck();
  }

  public abstract update(params, forceUpdate: boolean);

  protected setLoading(loading = true) {
    this.loading = loading;
    if (this.loading) {
      this.error = false;
    }
    this.cd.markForCheck();
  }

  protected updateDatasets(setId: string, datasets: any[]) {
    if (!this.charts) {
      return;
    }
    const c = this.charts.find(_ => _.id === setId);
    if (!c) {
      return;
    }

    c.datasets = datasets;
  }
}
