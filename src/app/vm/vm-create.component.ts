import { Component, OnInit } from '@angular/core';

import { VmService } from './vm.service';
import { TranslateService } from 'ng2-translate';
import { ZoneService } from '../shared/services/zone.service';
import { Zone } from '../shared/models/zone.model';

@Component({
  selector: 'cs-vm-create',
  templateUrl: './vm-create.component.html',
  styleUrls: ['./vm-create.component.scss']
})
export class VmCreateComponent implements OnInit {

  public rootDiskSize: number;
  public zones: Array<Zone>;
  public zone: number;

  constructor (
    private vmService: VmService,
    private translateService: TranslateService,
    private zoneService: ZoneService
  ) {
    this.rootDiskSize = 0;
    this.zones = [];
    this.zone = 0;
  }

  public ngOnInit() {
    this.zoneService.getList().then(result => {
      this.zones = result;
      this.zone = result[0].id;
    })
  }
}
