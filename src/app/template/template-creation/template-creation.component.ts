import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

import { OsType, OsTypeService, Zone, ZoneService } from '../../shared';
import { Snapshot } from '../../shared/models/snapshot.model';


export interface RegisterTemplateBaseParams {
  displayText: string;
  name: string;
  osTypeId: string;
  url?: string;
  zoneId?: string;
  passwordEnabled?: boolean;
  isDynamicallyScalable?: boolean;
  snapshotId?: string;
}

export class TemplateFormData {
  constructor(
    public mode: 'Template' | 'Iso',
    public snapshot?: Snapshot,
    public name = '',
    public displayText = '',
    public osTypeId = '',
    public url = '',
    public zoneId = '',
    public passwordEnabled = false,
    public dynamicallyScalable = false,
  ) {}

  public getParams(): RegisterTemplateBaseParams {
    const params = {
      name: this.name,
      displayText: this.displayText,
      osTypeId: this.osTypeId,
    };

    if (this.snapshot) {
      params['snapshotId'] = this.snapshot.id;
      return params;
    }

    params['url'] = this.url;
    params['zoneId'] = this.zoneId;

    if (this.mode === 'Template') {
      params['passwordEnabled'] = this.passwordEnabled;
      params['isDynamicallyScalable'] = this.dynamicallyScalable;
      params['hypervisor'] = 'KVM';
      params['format'] = 'QCOW2';
      params['requiresHvm'] = true;
    }
    return params;
  }
}

@Component({
  selector: 'cs-template-creation',
  templateUrl: 'template-creation.component.html',
  styleUrls: ['template-creation.component.scss']
})
export class TemplateCreationComponent implements OnInit {
  public templateFormData: TemplateFormData;
  public osTypes: Array<OsType>;
  public zones: Array<Zone>;

  constructor(
    private dialog: MdlDialogReference,
    private osTypeService: OsTypeService,
    private zoneService: ZoneService,
    @Optional() @Inject('snapshot') public snapshot: Snapshot,
    @Optional() @Inject('formData') public formData: TemplateFormData,
    @Inject('mode') public mode: 'Template' | 'Iso'
  ) { }

  public ngOnInit(): void {
    let osTypeId = '';
    let zoneId = '';

    this.osTypes = [];
    this.osTypeService
      .getList()
      .subscribe(osTypes => {
        this.osTypes = osTypes;
        osTypeId = this.osTypes[0].id;
      });

    if (!this.snapshot) {
      this.zones = [];
      this.zoneService
        .getList()
        .subscribe(zones => {
          this.zones = zones;
          zoneId = this.zones[0].id;
        });
    }

    if (this.formData) {
      this.templateFormData = this.formData;
    } else {
      this.templateFormData = new TemplateFormData(this.mode, this.snapshot);
      this.templateFormData.osTypeId = osTypeId;
      this.templateFormData.zoneId = zoneId;
    }
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  public onCreate(): void {
    this.dialog.hide(this.templateFormData);
  }
}
