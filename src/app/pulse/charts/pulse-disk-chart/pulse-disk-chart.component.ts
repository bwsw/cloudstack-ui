import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../../shared/models/volume.model';
import { VolumeService } from '../../../shared/services/volume.service';
import { PulseService } from '../../pulse.service';
import { humanReadableSize } from '../../unitsUtils';
import { defaultChartOptions, getChart, PulseChartComponent } from '../pulse-chart';


@Component({
  selector: 'cs-pulse-disk-chart',
  templateUrl: './pulse-disk-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PulseDiskChartComponent extends PulseChartComponent implements OnInit {
  @Input() public vmId: string;
  public selectedVolume: Volume;
  public availableVolumes: Array<Volume>;

  constructor(
    pulse: PulseService,
    cd: ChangeDetectorRef,
    private volumeService: VolumeService
  ) {
    super(pulse, cd);
  }

  public ngOnInit() {
    this.charts = getChart([
      {
        id: 'bytes',
        options: {
          ...defaultChartOptions,
          scales: {
            ...defaultChartOptions.scales,
            yAxes: [
              {
                ticks: {
                  suggestedMin: 0,
                  userCallback(val) {
                    return humanReadableSize(val, true);
                  }
                }
              }
            ]
          }
        }
      },
      { id: 'iops' },
      {
        id: 'errors',
        labels: [],
        chartType: 'bar'
      }
    ]);

    this.volumeService
      .getList({ virtualMachineId: this.vmId })
      .subscribe(volumes => {
        this.availableVolumes = volumes;
        this.selectedVolume = this.availableVolumes[0];
        this.cd.markForCheck();
      });
  }

  public update(params, forceUpdate) {
    const requests = params.selectedAggregations.map(_ =>
      this.pulse.disk(params.vmId, this.selectedVolume.id, {
        range: params.selectedScale.range,
        aggregation: _,
        shift: `${params.shiftAmount}${params.selectedShift || 'w'}`
      }, forceUpdate)
    );

    Observable.forkJoin(...requests)
      .subscribe(data => {
        const sets = {
          bytes: [],
          iops: [],
          errors: []
        };
        data.forEach((res: any, ind) => {
          const readBytes = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readBytes
            })),
            label: `Disk read ${params.selectedAggregations[ind]}`
          };
          const writeBytes = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writeBytes
            })),
            label: `Disk write ${params.selectedAggregations[ind]}`
          };
          sets.bytes.push(readBytes, writeBytes);


          const readIops = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readIOPS
            })),
            label: `Disk read iops ${params.selectedAggregations[ind]}`
          };
          const writeIops = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writeIOPS
            })),
            label: `Disk write iops ${params.selectedAggregations[ind]}`
          };

          sets.iops.push(readIops, writeIops);


          this.charts[2].labels = res.map(_ => new Date(_.time)); // TODO
          const errors = {
            data: res.map(_ => +_.ioErrors),
            label: `Disk io errors ${params.selectedAggregations[ind]}`
          };
          sets.errors.push(errors);
        });
        Object.keys(sets).forEach(_ => this.updateDatasets(_, sets[_]));

        this.cd.markForCheck();
      });
  }
}
