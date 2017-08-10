import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NIC } from '../../../shared/models/nic.model';
import { VmService } from '../../../vm/shared/vm.service';
import { PulseService } from '../../pulse.service';
import { humanReadableSizeInBits } from '../../unitsUtils';
import { defaultChartOptions, getChart, PulseChartComponent } from '../pulse-chart';


@Component({
  selector: 'cs-pulse-network-chart',
  templateUrl: './pulse-network-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PulseNetworkChartComponent extends PulseChartComponent implements OnInit {
  @Input() vmId: string;
  public selectedNic: NIC;
  public availableNics: Array<NIC> = [];

  constructor(
    pulse: PulseService,
    cd: ChangeDetectorRef,
    private vmService: VmService
  ) {
    super(pulse, cd);
  }

  public ngOnInit() {
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
                  suggestedMin: 0,
                  userCallback(val) {
                    return humanReadableSizeInBits(val);
                  }
                }
              }
            ]
          }
        }
      },
      { id: 'packets' },
      {
        id: 'drops',
        labels: [],
        chartType: 'bar'
      },
      {
        id: 'errors',
        labels: [],
        chartType: 'bar'
      }
    ]);

    this.vmService
      .get(this.vmId)
      .subscribe(vm => {
        this.availableNics = vm.nic;
        this.selectedNic = this.availableNics[0];
        this.cd.markForCheck();
      });
  }

  public update(params, forceUpdate) {
    const requests = params.selectedAggregations.map(_ =>
      this.pulse.network(this.vmId, this.selectedNic.macAddress, {
        range: params.selectedScale.range,
        aggregation: _,
        shift: `${params.shiftAmount}${params.selectedShift || 'w'}`
      }, forceUpdate)
    );

    this.setLoading(!forceUpdate);
    Observable.forkJoin(...requests)
      .finally(() => this.setLoading(false))
      .subscribe(data => {
        const sets = {
          bits: [],
          packets: [],
          drops: [],
          errors: []
        };

        data.forEach((res: any, ind) => {
          const readBits = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readBits
            })),
            label: `Network read ${params.selectedAggregations[ind]}`
          };
          const writeBits = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writeBits
            })),
            label: `Network write ${params.selectedAggregations[ind]}`
          };
          sets.bits.push(readBits, writeBits);

          const readPackets = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readPackets
            })),
            label: `Network read packets ${params.selectedAggregations[ind]}`
          };
          const writePackets = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writePackets
            })),
            label: `Network write packets ${params.selectedAggregations[ind]}`
          };
          sets.packets.push(readPackets, writePackets);

          const readDrops = {
            data: res.map(_ => +_.readDrops),
            label: `Network read drops ${params.selectedAggregations[ind]}`
          };
          const writeDrops = {
            data: res.map(_ => +_.writeDrops),
            label: `Network write drops ${params.selectedAggregations[ind]}`
          };
          this.charts[2].labels = res.map(_ => new Date(_.time));
          sets.drops.push(readDrops, writeDrops);

          const readErrors = {
            data: res.map(_ => +_.readErrors),
            label: `Network read errors ${params.selectedAggregations[ind]}`
          };
          const writeErrors = {
            data: res.map(_ => +_.writeErrors),
            label: `Network write errors ${params.selectedAggregations[ind]}`
          };
          this.charts[3].labels = res.map(_ => new Date(_.time));
          sets.errors.push(readErrors, writeErrors);
        });

        Object.keys(sets).forEach(_ => this.updateDatasets(_, sets[_]));

        this.cd.markForCheck();
      });
  }
}
