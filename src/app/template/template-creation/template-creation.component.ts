import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { OsType, Zone } from '../../shared';
import { Snapshot } from '../../shared/models/snapshot.model';
import { OsTypeService } from '../../shared/services/os-type.service';
import { ZoneService } from '../../shared/services/zone.service';
import { TemplateCreateAction } from '../../shared/actions/template-actions/create/template-create';
import { IsoCreateAction } from '../../shared/actions/template-actions/create/iso-create';
import { Observable } from 'rxjs/Observable';
import { InstanceGroup } from '../../shared/models/instance-group.model';
import { IsoService } from '../shared/iso/iso.service';
import { TemplateService } from '../shared/template/template.service';


@Component({
  selector: 'cs-template-creation',
  templateUrl: 'template-creation.component.html',
  styleUrls: ['template-creation.component.scss']
})
export class TemplateCreationComponent implements OnInit {
  public mode: string;
  public snapshot?: Snapshot;
  public name: string;
  public displayText: string;
  public osTypeId: string;
  public url: string;
  public zoneId: string;

  public passwordEnabled: boolean;
  public dynamicallyScalable: boolean;

  public osTypes: Array<OsType>;
  public zones: Array<Zone>;

  public loading: boolean;

  public instanceGroupName: string;
  public templateGroupNames: Array<string> = [];
  public isoGroupNames: Array<string> = [];

  constructor(
    private dialogRef: MdDialogRef<TemplateCreationComponent>,
    private osTypeService: OsTypeService,
    private isoService: IsoService,
    private templateService: TemplateService,
    private isoCreationAction: IsoCreateAction,
    private templateCreationAction: TemplateCreateAction,
    private zoneService: ZoneService,
    @Inject(MD_DIALOG_DATA) data: any
  ) {
    this.mode = data.mode;
    this.snapshot = data.snapshot;
  }

  public ngOnInit(): void {
    this.passwordEnabled = this.dynamicallyScalable = false;
    this.loadOsTypes();
    this.loadZones();
    this.loadGroups();
  }

  public get groups(): Array<string> {
    if (this.mode === 'Template') {
      return this.templateGroupNames;
    } else {
      return this.isoGroupNames;
    }
  }

  public get modeTranslationToken(): string {
    const modeTranslations = {
      'TEMPLATE': 'TEMPLATE_PAGE.TEMPLATE_CREATION.NEW_TEMPLATE',
      'ISO': 'TEMPLATE_PAGE.TEMPLATE_CREATION.NEW_ISO'
    };

    return modeTranslations[this.mode.toUpperCase()];
  }

  public onCancel(): void {
    this.dialogRef.close();
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
        params['entity'] = 'Template';
      } else {
        params['entity'] = 'Iso';
      }
    } else {
      params['snapshotId'] = this.snapshot.id;
    }

    if (this.instanceGroupName) {
      params['group'] = new InstanceGroup(this.instanceGroupName);
    }

    this.loading = true;

    this.getCreationAction(params)
      .finally(() => this.loading = false)
      .subscribe(
        template => this.dialogRef.close(template),
        () => {}
      );
  }

  private getCreationAction(params: any): Observable<void> {
    if (this.mode === 'Iso') {
      return this.isoCreationAction.activate(params);
    } else {
      return this.templateCreationAction.activate(params);
    }
  }

  private loadOsTypes(): void {
    this.osTypes = [];
    this.osTypeService
      .getList()
      .subscribe(osTypes => {
        this.osTypes = osTypes;
        this.osTypeId = this.osTypes[0].id;
      });
  }

  private loadZones(): void {
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

  private loadGroups(): void {
    Observable.forkJoin(
      this.templateService.getInstanceGroupList(),
      this.isoService.getInstanceGroupList()
    )
      .subscribe(([templateGroups, isoGroups]) => {
        this.templateGroupNames = templateGroups.map(group => group.name);
        this.isoGroupNames = isoGroups.map(group => group.name);
      });
  }
}
