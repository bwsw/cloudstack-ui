import { Component } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

import { IsoService } from '../shared';
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
  public description: string;
  public url: string;
  public zoneId: string;
  public osTypeId: string;

  public osTypes: Array<OsType>;
  public zones: Array<Zone>;

  constructor(
    private dialog: MdlDialogReference,
    private isoService: IsoService,
    private osTypeService: OsTypeService,
    private zoneService: ZoneService
  ) { }

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
    this.dialog.hide();
  }
}
