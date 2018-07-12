import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Hypervisor, OsType, Zone } from '../../shared';
import { Account, isRootAdmin, Snapshot, TemplateGroup } from '../../shared/models';
import { HypervisorService } from '../../shared/services/hypervisor.service';
import { CreateTemplateBaseParams, TemplateResourceType } from '../shared/base-template.service';
import { Language } from '../../shared/types';

interface TemplateFormat {
  name: string;
  hypervisors: string[];
}

@Component({
  selector: 'cs-template-creation',
  templateUrl: 'template-creation.component.html',
  styleUrls: ['template-creation.component.scss']
})
export class TemplateCreationComponent implements OnInit {
  @Input() public mode: string;
  @Input() public account: Account;
  @Input() public osTypes: Array<OsType>;
  @Input() public zones: Array<Zone>;
  @Input() public groups: Array<TemplateGroup>;
  @Input() public snapshot?: Snapshot;

  @Output() public onCreateTemplate = new EventEmitter<CreateTemplateBaseParams>();

  public name: string;
  public displayText: string;
  public osTypeId: string;
  public url: string;
  public zoneId: string;
  public templateGroup: TemplateGroup;
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


  public hypervisors: Array<Hypervisor>;

  public formats: TemplateFormat[] = [
    { name: 'VHD', hypervisors: ['XenServer', 'Hyperv', 'KVM'] },
    { name: 'OVA', hypervisors: ['VMware'] },
    { name: 'QCOW2', hypervisors: ['KVM'] },
    { name: 'RAW', hypervisors: ['KVM', 'Ovm'] },
    { name: 'VMDK', hypervisors: ['KVM'] },
    { name: 'BareMetal', hypervisors: ['BareMetal'] },
    { name: 'TAR', hypervisors: ['LXC'] },
    { name: 'VHDX', hypervisors: ['Hyperv'] }
  ];
  public visibleFormats: TemplateFormat[];

  public showAdditional = false;

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public get TemplateResourceType() {
    return TemplateResourceType;
  }

  constructor(
    private hypervisorService: HypervisorService,
    private translate: TranslateService,
  ) {
    this.visibleFormats = this.formats;
  }

  public ngOnInit(): void {
    this.passwordEnabled = this.dynamicallyScalable = false;
    this.getHypervisors();
  }

  public getHypervisors() {
    this.hypervisorService.getList().subscribe((hypervisors) => {
      this.hypervisors = hypervisors;
    });
  }

  public changeHypervisor() {
    this.visibleFormats = this.filterFormats(this.formats, this.hypervisor);
  }

  public filterFormats(formats: TemplateFormat[], hypervisor: string) {
    return hypervisor
      ? formats.filter(f => f.hypervisors.find(h => h === hypervisor))
      : formats;
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

    if (this.templateGroup) {
      params['groupId'] = this.templateGroup.id;
    }

    if (!this.snapshot) {
      params['url'] = this.url;
      params['zoneId'] = this.zoneId;
    } else {
      params['snapshotId'] = this.snapshot.id;
    }

    if (this.mode === TemplateResourceType.template) {
      params['passwordEnabled'] = this.passwordEnabled;
      params['isDynamicallyScalable'] = this.dynamicallyScalable;
      params['entity'] = TemplateResourceType.template;
    } else {
      params['entity'] = TemplateResourceType.iso;
    }

    if (this.showAdditional) {
      params['isextractable'] = this.isExtractable;
      params['bootable'] = this.bootable;
      params['format'] = this.format;
      params['requireshvm'] = this.requiresHvm;
      params['hypervisor'] = this.hypervisor;
      if (this.isRootAdmin) {
        params['isrouting'] = this.isRouting;
        params['isfeatured'] = this.isFeatured;
        params['ispublic'] = this.isPublic;
      }
    }

    this.onCreateTemplate.emit(params);
  }

  public get isRootAdmin(): boolean {
    return isRootAdmin(this.account);
  }
}
