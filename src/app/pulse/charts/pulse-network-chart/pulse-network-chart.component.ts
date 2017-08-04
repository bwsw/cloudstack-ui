import { Component, OnInit } from '@angular/core';
import { VmService } from '../../../vm/shared/vm.service';
import { PulseService } from '../../pulse.service';
import { getChart, PulseChartComponent } from '../pulse-chart';
import { Observable } from 'rxjs/Observable';
import { NIC } from '../../../shared/models/nic.model';

@Component({
  selector: 'cs-pulse-network-chart',
  templateUrl: './pulse-network-chart.component.html'
})
export class PulseNetworkChartComponent extends PulseChartComponent implements OnInit {
  public selectedNic: NIC;
  public availableNics: Array<NIC> = [];

  constructor(pulse: PulseService, private vmService: VmService) {
    super(pulse);
  }

  public ngOnInit() {
    this.charts = getChart([
      { id: 'bits' },
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
      });
  }

  public update() {
    const requests = this.selectedAggregations.map(_ =>
      this.pulse.network(this.vmId, this.selectedNic.macAddress, {
        range: this.selectedScale.range,
        aggregation: _,
        shift: `${this.shift}${this.selectedShift || 'w'}`
      })
    );

    Observable.forkJoin(...requests)
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
            label: `Network read ${this.selectedAggregations[ind]}`
          };
          const writeBits = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writeBits
            })),
            label: `Network write ${this.selectedAggregations[ind]}`
          };
          sets.bits.push(readBits, writeBits);

          const readPackets = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readPackets
            })),
            label: `Network read packets ${this.selectedAggregations[ind]}`
          };
          const writePackets = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writePackets
            })),
            label: `Network write packets ${this.selectedAggregations[ind]}`
          };
          sets.packets.push(readPackets, writePackets);

          const readDrops = {
            data: res.map(_ => +_.readDrops),
            label: `Network read drops ${this.selectedAggregations[ind]}`
          };
          const writeDrops = {
            data: res.map(_ => +_.writeDrops),
            label: `Network write drops ${this.selectedAggregations[ind]}`
          };
          this.charts[2].labels = res.map(_ => new Date(_.time));
          sets.drops.push(readDrops, writeDrops);

          const readErrors = {
            data: res.map(_ => +_.readErrors),
            label: `Network read errors ${this.selectedAggregations[ind]}`
          };
          const writeErrors = {
            data: res.map(_ => +_.writeErrors),
            label: `Network write errors ${this.selectedAggregations[ind]}`
          };
          this.charts[3].labels = res.map(_ => new Date(_.time));
          sets.errors.push(readErrors, writeErrors);
        });

        Object.keys(sets).forEach(_ => this.updateDatasets(_, sets[_]));
      });
  }
}
