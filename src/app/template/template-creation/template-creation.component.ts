import { Component, OnInit, Inject, Optional } from '@angular/core';

import { OsType, OsTypeService, Zone, ZoneService } from '../../shared';
import { Snapshot } from '../../shared/models/snapshot.model';
import { MdlDialogReference } from '../../dialog/dialog-module';


@Component({
  selector: 'cs-template-creation',
  templateUrl: 'template-creation.component.html',
  styleUrls: ['template-creation.component.scss']
})
export class TemplateCreationComponent implements OnInit {
  public name: string;
  public displayText: string;
  public osTypeId: string;
  public url: string;
  public zoneId: string;

  public passwordEnabled: boolean;
  public dynamicallyScalable: boolean;

  public osTypes: Array<OsType>;
  public zones: Array<Zone>;

  constructor(
    private dialog: MdlDialogReference,
    private osTypeService: OsTypeService,
    private zoneService: ZoneService,
    @Optional() @Inject('snapshot') public snapshot: Snapshot,
    @Inject('mode') public mode: string
  ) { }

  public ngOnInit(): void {
    this.passwordEnabled = this.dynamicallyScalable = false;

    this.osTypes = [];
    this.osTypeService
      .getList()
      .subscribe(osTypes => {
        this.osTypes = osTypes;
        this.osTypeId = this.osTypes[0].id;
      });

    if (!this.snapshot) {
      this.zones = [];
      this.zoneService
        .getList()
        .subscribe(zones => {
          this.zones = zones;
          this.zoneId = this.zones[0].id;
        });
    }
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  public onCreate(): void {
    const params = {
      name: this.name,
      displayText: this.displayText,
      osTypeId: this.osTypeId,
    };

    if (!this.snapshot) {
      params['url'] = this.url;
      params['zoneId'] = this.zoneId;

      if (this.mode === 'Template') {
        params['passwordEnabled'] = this.passwordEnabled;
        params['isDynamicallyScalable'] = this.dynamicallyScalable;
      }
    } else {
      params['snapshotId'] = this.snapshot.id;
    }

    this.dialog.hide(params);
  }
}
