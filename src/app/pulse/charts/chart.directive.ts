import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Chart } from 'chart.js';

@Directive({ selector: 'canvas[csBaseChart]', exportAs: 'cs-base-chart' })
export class BaseChartDirective implements OnDestroy, OnChanges, OnInit {
  public static defaultColors: number[][] = [
    [255, 99, 132],
    [54, 162, 235],
    [255, 206, 86],
    [231, 233, 237],
    [75, 192, 192],
    [151, 187, 205],
    [220, 220, 220],
    [247, 70, 74],
    [70, 191, 189],
    [253, 180, 92],
    [148, 159, 177],
    [77, 83, 96],
  ];

  @Input()
  public data: number[] | any[];
  @Input()
  public datasets: any[];
  @Input()
  public labels: any[] = [];
  @Input()
  public options: any = {};
  @Input()
  public chartType: string;
  @Input()
  public colors: any[];
  @Input()
  public legend: boolean;

  @Output()
  public chartClick: EventEmitter<any> = new EventEmitter();
  @Output()
  public chartHover: EventEmitter<any> = new EventEmitter();

  public ctx: any;
  public chart: any;
  private initFlag = false;

  private element: ElementRef;

  public constructor(element: ElementRef) {
    this.element = element;
  }

  public ngOnInit() {
    this.ctx = this.element.nativeElement.getContext('2d');
    this.initFlag = true;
    if (this.data || this.datasets) {
      this.refresh();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.initFlag) {
      // Check if the changes are in the data or datasets
      if (changes.hasOwnProperty('data') || changes.hasOwnProperty('datasets')) {
        if (changes['data']) {
          this.updateChartData(changes['data'].currentValue);
        } else {
          this.updateChartData(changes['datasets'].currentValue);
        }

        this.chart.update();
      } else {
        // otherwise rebuild the chart
        this.refresh();
      }
    }
  }

  public ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = void 0;
    }
  }

  public getChartBuilder(ctx: any): any {
    const datasets: any = this.getDatasets();

    const options: any = { ...this.options };
    if (!this.legend) {
      options.legend = { display: false };
    }
    // hock for onHover and onClick events
    options.hover = options.hover || {};
    if (!options.hover.onHover) {
      options.hover.onHover = (active: any[]) => {
        if (active && !active.length) {
          return;
        }
        this.chartHover.emit({ active });
      };
    }

    if (!options.onClick) {
      options.onClick = (event: any, active: any[]) => {
        this.chartClick.emit({ event, active });
      };
    }

    const opts = {
      options,
      type: this.chartType,
      data: {
        datasets,
        labels: this.labels,
      },
    };

    return new Chart(ctx, opts);
  }

  private updateChartData(newDataValues: number[] | any[]): void {
    if (Array.isArray(newDataValues[0].data)) {
      if (newDataValues.length === this.chart.data.datasets.length) {
        this.chart.data.datasets.forEach((dataset: any, i: number) => {
          dataset.data = newDataValues[i].data;

          if (newDataValues[i].label) {
            dataset.label = newDataValues[i].label;
          }
        });
      } else {
        this.chart.data.datasets = this.getDatasets();
      }
    } else {
      this.chart.data.datasets[0].data = newDataValues;
    }
  }

  private getDatasets(): any {
    let datasets: any = void 0;
    // in case if datasets is not provided, but data is present
    if (!this.datasets || (!this.datasets.length && (this.data && this.data.length))) {
      if (Array.isArray(this.data[0])) {
        datasets = (this.data as number[][]).map((data: number[], index: number) => {
          return { data, label: this.labels[index] || `Label ${index}` };
        });
      } else {
        datasets = [{ data: this.data, label: `Label 0` }];
      }
    }

    if ((this.datasets && this.datasets.length) || (datasets && datasets.length)) {
      datasets = (this.datasets || datasets).map((elm: any, index: number) => {
        const newElm: any = { ...elm };
        if (this.colors && this.colors.length) {
          Object.assign(newElm, this.colors[index]);
        } else {
          Object.assign(newElm, getColors(this.chartType, index, newElm.data.length));
        }
        return newElm;
      });
    }

    if (!datasets) {
      throw new Error(`ng-charts configuration error,
      data or datasets field are required to render char ${this.chartType}`);
    }

    return datasets;
  }

  private refresh(): any {
    // if (this.options && this.options.responsive) {
    //   setTimeout(() => this.refresh(), 50);
    // }

    // todo: remove this line, it is producing flickering
    this.ngOnDestroy();
    this.chart = this.getChartBuilder(this.ctx /*, data, this.options*/);
  }
}

// private helper functions
export interface Color {
  backgroundColor?: string | string[];
  borderWidth?: number | number[];
  borderColor?: string | string[];
  borderCapStyle?: string;
  borderDash?: number[];
  borderDashOffset?: number;
  borderJoinStyle?: string;

  pointBorderColor?: string | string[];
  pointBackgroundColor?: string | string[];
  pointBorderWidth?: number | number[];

  pointRadius?: number | number[];
  pointHoverRadius?: number | number[];
  pointHitRadius?: number | number[];

  pointHoverBackgroundColor?: string | string[];
  pointHoverBorderColor?: string | string[];
  pointHoverBorderWidth?: number | number[];
  pointStyle?: string | string[];

  hoverBackgroundColor?: string | string[];
  hoverBorderColor?: string | string[];
  hoverBorderWidth?: number;
}

// pie | doughnut
export interface Colors extends Color {
  data?: number[];
  label?: string;
}

function rgba(colour: number[], alpha: number): string {
  const rgbaValues = colour.concat(alpha).join(',');
  return `rgba(${rgbaValues})`;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatLineColor(colors: number[]): Color {
  return {
    backgroundColor: rgba(colors, 0.4),
    borderColor: rgba(colors, 1),
    pointBackgroundColor: rgba(colors, 1),
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: rgba(colors, 0.8),
  };
}

function formatBarColor(colors: number[]): Color {
  return {
    backgroundColor: rgba(colors, 0.6),
    borderColor: rgba(colors, 1),
    hoverBackgroundColor: rgba(colors, 0.8),
    hoverBorderColor: rgba(colors, 1),
  };
}

function formatPieColors(colors: number[][]): Colors {
  return {
    backgroundColor: colors.map((color: number[]) => rgba(color, 0.6)),
    borderColor: colors.map(() => '#fff'),
    pointBackgroundColor: colors.map((color: number[]) => rgba(color, 1)),
    pointBorderColor: colors.map(() => '#fff'),
    pointHoverBackgroundColor: colors.map((color: number[]) => rgba(color, 1)),
    pointHoverBorderColor: colors.map((color: number[]) => rgba(color, 1)),
  };
}

function formatPolarAreaColors(colors: number[][]): Color {
  return {
    backgroundColor: colors.map((color: number[]) => rgba(color, 0.6)),
    borderColor: colors.map((color: number[]) => rgba(color, 1)),
    hoverBackgroundColor: colors.map((color: number[]) => rgba(color, 0.8)),
    hoverBorderColor: colors.map((color: number[]) => rgba(color, 1)),
  };
}

function getRandomColor(): number[] {
  return [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
}

/**
 * Generate colors for line|bar charts
 * @param index
 * @returns {number[]|Color}
 */
function generateColor(index: number): number[] {
  return BaseChartDirective.defaultColors[index] || getRandomColor();
}

/**
 * Generate colors for pie|doughnut charts
 * @param count
 * @returns {Colors}
 */
function generateColors(count: number): number[][] {
  const colorsArr: number[][] = [];
  for (let i = 0; i < count; i += 1) {
    colorsArr[i] = BaseChartDirective.defaultColors[i] || getRandomColor();
  }
  return colorsArr;
}

/**
 * Generate colors by chart type
 * @param chartType
 * @param index
 * @param count
 * @returns {Color}
 */
function getColors(chartType: string, index: number, count: number): number[] | Color {
  if (chartType === 'pie' || chartType === 'doughnut') {
    return formatPieColors(generateColors(count));
  }

  if (chartType === 'polarArea') {
    return formatPolarAreaColors(generateColors(count));
  }

  if (chartType === 'line' || chartType === 'radar') {
    return formatLineColor(generateColor(index));
  }

  if (chartType === 'bar' || chartType === 'horizontalBar') {
    return formatBarColor(generateColor(index));
  }
  return generateColor(index);
}
