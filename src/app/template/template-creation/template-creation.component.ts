import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { Hypervisor, OsType, Zone } from '../../shared';
import { IsoCreateAction } from '../../shared/actions/template-actions/create/iso-create';
import { TemplateCreateAction } from '../../shared/actions/template-actions/create/template-create';
import { Snapshot } from '../../shared/models/snapshot.model';
import { OsTypeService } from '../../shared/services/os-type.service';
import { ZoneService } from '../../shared/services/zone.service';
import { HypervisorService } from '../../shared/services/hypervisor.service';
import { AuthService } from "../../shared/services/auth.service";

interface TemplateFormat {
  name: string;
  hypervisors: string;
}

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
  public isExtractable: boolean;
  public hypervisor: string;
  public isPublic: boolean;
  public isRouting: boolean;
  public requiresHvm: boolean;
  public isFeatured: boolean;
  public format: string;
  public bootable: boolean;

  public passwordEnabled: boolean;
  public dynamicallyScalable: boolean;

  public osTypes: Array<OsType>;
  public zones: Array<Zone>;
  public hypervisors: Array<Hypervisor>;

  public formats: TemplateFormat[] = [
    { name: 'VHD', hypervisors: 'XenServer,Hyperv,KVM' },
    { name: 'OVA', hypervisors: 'VMware' },
    { name: 'QCOW2', hypervisors: 'KVM' },
    { name: 'RAW', hypervisors: 'KVM,Ovm' },
    { name: 'VMDK', hypervisors: 'KVM' },
    { name: 'BareMetal', hypervisors: 'BareMetal' },
    { name: 'TAR', hypervisors: 'LXC' },
    { name: 'VHDX', hypervisors: 'Hyperv' }
  ];
  public visibleFormats: TemplateFormat[];

  public loading: boolean;
  public showAdditional: boolean = false;

  constructor(
    private dialogRef: MdDialogRef<TemplateCreationComponent>,
    private osTypeService: OsTypeService,
    private isoCreationAction: IsoCreateAction,
    private templateCreationAction: TemplateCreateAction,
    private zoneService: ZoneService,
    private hypervisorService: HypervisorService,
    private authService: AuthService,
    @Inject(MD_DIALOG_DATA) data: any
  ) {
    this.mode = data.mode;
    this.snapshot = data.snapshot;
    this.visibleFormats = this.formats;
  }

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
    this.getHypervisors();
  }

  public getHypervisors() {
    this.hypervisorService.getList().subscribe((hypervisors) => {
      this.hypervisors = hypervisors;
    });
  }

  public changeHypervisor(hypervisor: string) {
    this.visibleFormats = this.filterFormats(this.formats, this.hypervisor);
  }

  public filterFormats(formats: TemplateFormat[], hypervisor: string) {
    return hypervisor ? formats.filter(f => f.hypervisors.includes(hypervisor)): formats;
  }

  public get modeTranslationToken(): string {
    const modeTranslations = {
      'TEMPLATE': 'TEMPLATE_PAGE.TEMPLATE_CREATION.NEW_TEMPLATE',
      'ISO': 'TEMPLATE_PAGE.TEMPLATE_CREATION.NEW_ISO'
    };

    return modeTranslations[this.mode.toUpperCase()];
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

    if (this.showAdditional) {
      params['isextractable'] = this.isExtractable;
      params['bootable'] = this.bootable;
      params['format'] = this.format;
      params['requireshvm'] = this.requiresHvm;
      params['ispublic'] = this.isPublic;
      params['hypervisor'] = this.hypervisor;
      if (this.isAdmin()) {
        params['isrouting'] = this.isRouting;
        params['isfeatured'] = this.isFeatured;
      }
    }

    this.loading = true;

    this.getCreationAction(params)
      .finally(() => this.loading = false)
      .subscribe(
        template => this.dialogRef.close(template),
        () => {}
      );
  }

  public isAdmin() {
    return this.authService.isAdmin;
  }

  private getCreationAction(params: any): Observable<void> {
    if (this.mode === 'Iso') {
      return this.isoCreationAction.activate(params);
    } else {
      return this.templateCreationAction.activate(params);
    }
  }
}
