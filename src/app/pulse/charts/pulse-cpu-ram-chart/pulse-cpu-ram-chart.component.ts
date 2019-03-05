import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { humanReadableSize } from '../../units-utils';
import { defaultChartOptions, getChart, PulseChartComponent, tooltipLabel } from '../pulse-chart';

@Component({
  selector: 'cs-pulse-cpu-chart',
  templateUrl: '../pulse-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseCpuRamChartComponent extends PulseChartComponent implements OnInit {
  public ngOnInit() {
    const unitTranslations = this.unitTranslations;
    const ramConverter = val => humanReadableSize(val * 1000, true, unitTranslations);

    this.charts = getChart([
      {
        id: 'cpu',
        options: {
          ...defaultChartOptions,
          scales: {
            ...defaultChartOptions.scales,
            yAxes: [
              {
                ticks: {
                  ...defaultChartOptions.scales.yAxes[0].ticks,
                  suggestedMax: 100,
                  userCallback(val) {
                    return `${val}%`;
                  },
                },
              },
            ],
          },
          tooltips: {
            ...defaultChartOptions.tooltips,
            callbacks: {
              label: (tooltipItem, data) => {
                return `${tooltipLabel(tooltipItem, data)}${tooltipItem.yLabel}%`;
              },
            },
          },
        },
      },
      {
        id: 'ram',
        options: {
          ...defaultChartOptions,
          scales: {
            ...defaultChartOptions.scales,
            yAxes: [
              {
                ticks: {
                  ...defaultChartOptions.scales.yAxes[0].ticks,
                  userCallback(val) {
                    return ramConverter(val);
                  },
                },
              },
            ],
          },
          tooltips: {
            ...defaultChartOptions.tooltips,
            callbacks: {
              label: (tooltipItem, data) => {
                return tooltipLabel(tooltipItem, data) + ramConverter(tooltipItem.yLabel);
              },
            },
          },
        },
      },
    ]);
  }

  public update(params, forceUpdate = false) {
    const cpuRequests = params.selectedAggregations.map(_ =>
      this.pulse.cpuTime(
        params.vmId,
        {
          range: params.selectedScale.range,
          aggregation: _,
          shift: `${params.shiftAmount}${params.selectedShift || 'w'}`,
        },
        forceUpdate,
      ),
    );

    const ramRequests = params.selectedAggregations.map(_ =>
      this.pulse.ram(
        params.vmId,
        {
          range: params.selectedScale.range,
          aggregation: _,
          shift: `${params.shiftAmount}${params.selectedShift || 'w'}`,
        },
        forceUpdate,
      ),
    );
    if (cpuRequests.length) {
      this.setLoading(!forceUpdate);
      // todo
      // tslint:disable-next-line:deprecation
      forkJoin(forkJoin(...cpuRequests), forkJoin(...ramRequests))
        .pipe(finalize(() => this.setLoading(false)))
        .subscribe(
          ([data, ram]) => {
            this.error = false;
            const datasets = data.map((res: any, ind) => {
              const ag = params.selectedAggregations[ind].toUpperCase();
              const aggregationName =
                this.translations['INTERVALS']['AGGREGATIONS'][ag.toUpperCase()] || ag;
              return {
                data: res.map(_ => ({
                  x: new Date(_.time),
                  y: Math.min(+_.cpuTime, 100),
                })),
                label: `${this.translations['LABELS']['CPU']} ${aggregationName}`,
              };
            });
            this.updateDatasets('cpu', datasets);

            const asd = ram.map((res: any, ind) => {
              const ag = params.selectedAggregations[ind].toUpperCase();
              const aggregationName =
                this.translations['INTERVALS']['AGGREGATIONS'][ag.toUpperCase()] || ag;
              return {
                data: res.map(_ => ({
                  x: new Date(_.time),
                  y: +_.ram,
                })),
                label: `${this.translations['LABELS']['RAM']} ${aggregationName}`,
              };
            });
            this.updateDatasets('ram', asd);

            this.cd.markForCheck();
          },
          () => (this.error = true),
        );
    }
  }
}
