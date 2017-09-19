import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { OsType, Zone } from '../../shared';
import { IsoCreateAction } from '../../shared/actions/template-actions/create/iso-create';
import { IsoCreationData } from '../../shared/actions/template-actions/create/iso-creation-params';
import { TemplateCreateAction } from '../../shared/actions/template-actions/create/template-create';
import { TemplateCreationData } from '../../shared/actions/template-actions/create/template-creation-params';
import { InstanceGroup } from '../../shared/models/instance-group.model';
import { Snapshot } from '../../shared/models/snapshot.model';
import { OsTypeService } from '../../shared/services/os-type.service';
import { ZoneService } from '../../shared/services/zone.service';
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

  public instanceGroup: InstanceGroup;
  public templateGroups: Array<InstanceGroup> = [];
  public isoGroups: Array<InstanceGroup> = [];

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

  public get groups(): Array<InstanceGroup> {
    if (this.mode === 'Template') {
      return this.templateGroups;
    } else {
      return this.isoGroups;
    }
  }

  public get modeTranslationToken(): string {
    const modeTranslations = {
      'TEMPLATE': 'TEMPLATE_PAGE.TEMPLATE_CREATION.NEW_TEMPLATE',
      'ISO': 'TEMPLATE_PAGE.TEMPLATE_CREATION.NEW_ISO'
    };

    return modeTranslations[this.mode.toUpperCase()];
  }

  public onCreate(): void {
    this.loading = true;

    this.getCreationAction()
      .finally(() => this.loading = false)
      .subscribe(
        template => this.dialogRef.close(template),
        () => {}
      );
  }

  public onGroupChange(instanceGroup: InstanceGroup): void {
    this.instanceGroup = instanceGroup;
  }

  private getCreationAction(): Observable<void> {
    if (this.mode === 'Iso') {
      return this.isoCreationAction.activate(this.templateCreationData);
    } else {
      return this.templateCreationAction.activate(this.isoCreationData);
    }
  }

  private get templateCreationData(): TemplateCreationData {
    return {
      name: this.name,
      displayText: this.displayText,
      osTypeId: this.osTypeId,
      url: this.url,
      zoneId: this.zoneId,
      snapshot: this.snapshot,
      group: this.instanceGroup,
      passwordEnabled: this.passwordEnabled,
      isDynamicallyScalable: this.dynamicallyScalable
    };
  }

  private get isoCreationData(): IsoCreationData {
    return {
      name: this.name,
      displayText: this.displayText,
      osTypeId: this.osTypeId,
      url: this.url,
      zoneId: this.zoneId,
      snapshot: this.snapshot,
      group: this.instanceGroup
    };
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
        this.templateGroups = templateGroups;
        this.isoGroups = isoGroups;
      });
  }
}
