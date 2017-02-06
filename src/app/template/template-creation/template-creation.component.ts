import { Component } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

import { Iso, IsoService } from '../shared';
import { OsType, Zone } from '../../shared/models';
import { ZoneService } from '../../shared/services';
import { OsTypeService } from '../../shared/services/os-type.service';


@Component({
  selector: 'cs-template-creation',
  templateUrl: 'template-creation.component.html',
  styleUrls: ['template-creation.component.scss']
})
export class TemplateCreationComponent {
  public name: string;
  public displayText: string;
  public osTypeId: string;
  public url: string;
  public zoneId: string;

  public osTypes: Array<OsType>;
  public zones: Array<Zone>;

  constructor(
    private dialog: MdlDialogReference,
    private isoService: IsoService,
    private osTypeService: OsTypeService,
    private zoneService: ZoneService
  ) {
    this.url = 'http://nl.alpinelinux.org/alpine/v3.5/releases/x86/alpine-standard-3.5.1-x86.iso';
  }

  public ngOnInit(): void {
    this.osTypes = [];
    this.zones = [];
    this.osTypeService
      .getList()
      .subscribe(osTypes => {
        this.osTypes = osTypes;
        this.osTypeId = this.osTypes[0].id;
      });
    this.zoneService
      .getList()
      .subscribe(zones => {
        this.zones = zones;
        this.zoneId = this.zones[0].id;
      });
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  public onCreate(): void {
    let registerObservable = this.isoService.register(new Iso({
      name: this.name,
      displayText: this.displayText,
      osTypeId: this.osTypeId,
      zoneId: this.zoneId
    }), this.url);
    this.dialog.hide(registerObservable);
  }
}
