import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { NIC } from '../../../shared/models/nic.model';
import { VmService } from '../../../vm/shared/vm.service';
import { PulseService } from '../../pulse.service';
import { humanReadableSizeInBits } from '../../units-utils';
import { defaultChartOptions, getChart, PulseChartComponent, tooltipLabel } from '../pulse-chart';

@Component({
  selector: 'cs-pulse-network-chart',
  templateUrl: './pulse-network-chart.component.html',
  styleUrls: ['./pulse-network-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseNetworkChartComponent extends PulseChartComponent implements OnInit {
  @Input()
  vmId: string;
  @Output()
  public nicChange = new EventEmitter();
  public selectedNic: NIC;
  public availableNics: NIC[] = [];

  constructor(pulse: PulseService, cd: ChangeDetectorRef, private vmService: VmService) {
    super(pulse, cd);
  }

  public ngOnInit() {
    const unitTranslations = this.unitTranslations;
    const bitsConverter = val => {
      return !!humanReadableSizeInBits(val)
        ? `${humanReadableSizeInBits(val, unitTranslations)}/${unitTranslations['S']}`
        : null;
    };

    this.charts = getChart([
      {
        id: 'bits',
        options: {
          ...defaultChartOptions,
          scales: {
            ...defaultChartOptions.scales,
            yAxes: [
              {
                ticks: {
                  ...defaultChartOptions.scales.yAxes[0].ticks,
                  userCallback(val) {
                    return bitsConverter(val);
                  },
                },
              },
            ],
          },
          tooltips: {
            ...defaultChartOptions.tooltips,
            callbacks: {
              label: (tooltipItem, data) => {
                return tooltipLabel(tooltipItem, data) + bitsConverter(tooltipItem.yLabel);
              },
            },
          },
        },
      },
      { id: 'packets' },
      {
        id: 'drops',
        labels: [],
        chartType: 'bar',
      },
      {
        id: 'errors',
        labels: [],
        chartType: 'bar',
      },
    ]);

    this.vmService.get(this.vmId).subscribe(vm => {
      this.availableNics = vm.nic;
      this.selectedNic = this.availableNics[0];
      this.cd.markForCheck();
    });
  }

  public update(params, forceUpdate) {
    const requests = params.selectedAggregations.map(_ =>
      this.pulse.network(
        this.vmId,
        this.selectedNic.macaddress,
        {
          range: params.selectedScale.range,
          aggregation: _,
          shift: `${params.shiftAmount}${params.selectedShift || 'w'}`,
        },
        forceUpdate,
      ),
    );

    this.setLoading(!forceUpdate);
    // todo
    // tslint:disable-next-line:deprecation
    forkJoin(...requests)
      .pipe(finalize(() => this.setLoading(false)))
      .subscribe(data => {
        const sets = {
          bits: [],
          packets: [],
          drops: [],
          errors: [],
        };

        data.forEach((res: any, ind) => {
          const ag = params.selectedAggregations[ind];
          const aggregationName =
            this.translations['INTERVALS']['AGGREGATIONS'][ag.toUpperCase()] || ag;
          const readBits = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readBits,
            })),
            label: `${this.translations['LABELS']['NETWORK_READ']} ${aggregationName}`,
          };
          const writeBits = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writeBits,
            })),
            label: `${this.translations['LABELS']['NETWORK_WRITE']} ${aggregationName}`,
          };
          sets.bits.push(readBits, writeBits);

          const readPackets = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readPackets,
            })),
            label: `${this.translations['LABELS']['NETWORK_READ_PACKETS']} ${aggregationName}`,
          };
          const writePackets = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writePackets,
            })),
            label: `${this.translations['LABELS']['NETWORK_WRITE_PACKETS']} ${aggregationName}`,
          };
          sets.packets.push(readPackets, writePackets);

          const readDrops = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readDrops,
            })),
            label: `${this.translations['LABELS']['NETWORK_READ_DROPS']} ${aggregationName}`,
          };
          const writeDrops = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writeDrops,
            })),
            label: `${this.translations['LABELS']['NETWORK_WRITE_DROPS']} ${aggregationName}`,
          };
          sets.drops.push(readDrops, writeDrops);

          const readErrors = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readErrors,
            })),
            label: `${this.translations['LABELS']['NETWORK_READ_ERRORS']} ${aggregationName}`,
          };
          const writeErrors = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writeErrors,
            })),
            label: `${this.translations['LABELS']['NETWORK_WRITE_ERRORS']} ${aggregationName}`,
          };
          sets.errors.push(readErrors, writeErrors);
        });

        Object.keys(sets).forEach(_ => this.updateDatasets(_, sets[_]));

        this.cd.markForCheck();
      });
  }
}
