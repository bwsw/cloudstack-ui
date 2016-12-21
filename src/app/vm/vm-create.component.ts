import { Component, OnInit } from '@angular/core';

import { VmService } from './vm.service';
import { TranslateService } from 'ng2-translate';


@Component({
  selector: 'cs-vm-create',
  templateUrl: './vm-create.component.html',
  styleUrls: ['./vm-create.component.scss']
})
export class VmCreateComponent implements OnInit {

  constructor (
    private vmService: VmService,
    private translateService: TranslateService,
  ) { }

  public ngOnInit() {

  }
}
