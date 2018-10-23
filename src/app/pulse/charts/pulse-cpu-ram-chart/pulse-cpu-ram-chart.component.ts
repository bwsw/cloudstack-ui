import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { humanReadableSize } from '../../units-utils';
import { defaultChartOptions, getChart, PulseChartComponent } from '../pulse-chart';

@Component({
  selector: 'cs-pulse-cpu-chart',
  templateUrl: '../pulse-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseCpuRamChartComponent extends PulseChartComponent implements OnInit {
  public ngOnInit() {
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
                  padding: 40,
                  mirror: true,
                  suggestedMin: 0,
                  suggestedMax: 100,
                  userCallback(val) {
                    return `${val}%`;
                  },
                },
              },
            ],
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
                  padding: 40,
                  mirror: true,
                  suggestedMin: 0,
                  userCallback(val) {
                    return humanReadableSize(val * 1024);
                  },
                },
              },
            ],
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
              const aggregation = params.selectedAggregations[ind];
              return {
                data: res.map(_ => ({
                  x: new Date(_.time),
                  y: Math.min(+_.cpuTime, 100),
                })),
                label: `${this.translations['CPU']} ${aggregation}`,
              };
            });
            this.updateDatasets('cpu', datasets);

            const asd = ram.map((res: any, ind) => {
              const aggregation = params.selectedAggregations[ind];
              return {
                data: res.map(_ => ({
                  x: new Date(_.time),
                  y: +_.ram,
                })),
                label: `${this.translations['RAM']} ${aggregation}`,
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
