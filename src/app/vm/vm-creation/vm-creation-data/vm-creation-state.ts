import { Rules } from '../../../security-group/sg-creation/sg-creation.component';
import { AffinityGroup, DiskOffering, InstanceGroup, ServiceOffering, Zone } from '../../../shared/models';
import { AuthService } from '../../../shared/services';
import { ServiceLocator } from '../../../shared/services/service-locator';
import { UtilsService } from '../../../shared/services/utils.service';
import { BaseTemplateModel } from '../../../template/shared';
import { VmService } from '../../shared/vm.service';
import { VmCreationData } from './vm-creation-data';


export class VmCreationState {
  public affinityGroup: AffinityGroup;
  public displayName: string;
  public doStartVm: boolean;
  public instanceGroup: InstanceGroup;
  public keyboard: string;
  public keyPair: string;
  public rootDiskSize: number;
  public securityRules: Rules;
  public serviceOffering: ServiceOffering;
  public showRootDiskResize = false;
  public zone: Zone;

  private _diskOffering: DiskOffering;
  private _template: BaseTemplateModel;

  private auth: AuthService;
  private utils: UtilsService;
  private vmService: VmService;

  constructor(private data: VmCreationData) {
    this.auth = ServiceLocator.injector.get(AuthService);
    this.utils = ServiceLocator.injector.get(UtilsService);
    this.vmService = ServiceLocator.injector.get(VmService);

    this.init(data);
  }

  public get showSecurityGroups(): boolean {
    return !this.zone.networkTypeIsBasic;
  };

  public reset(): void {
    Object.keys(this).forEach(key => {
      if (key !== 'utils') {
        this[key] = null;
      }
    });
  }

  public set diskOffering(offering: DiskOffering) {
    this.showRootDiskResize = offering.isCustomized;
    this._diskOffering = offering;
  }

  public get template(): BaseTemplateModel {
    return this._template;
  }

  public set template(t: BaseTemplateModel) {
    if (t && this.utils.convertToGB(t.size || 0) < this.data.rootDiskSizeLimit) {
      this._template = t;
      this.setMinDiskSize();
    } else {
      // this.enoughResources = false;
    }
  }

  private setMinDiskSize(): void {
    const t = this.template;
    if (!t) {
      throw new Error('Template was not passed to set disk size');
    }

    if (t.size != null) {
      const newSize = t.size / Math.pow(2, 30);
      this.rootDiskSize = newSize;
    } else {
      this.rootDiskSize = 1;
    }
  }

  private init(data: VmCreationData): void {
    if (data.affinityGroupList.length) {
      this.affinityGroup = data.affinityGroupList[0];
    }

    if (data.serviceOfferings.length) {
      this.serviceOffering = data.serviceOfferings[0];
    }

    if (data.instanceGroups.length) {
      this.instanceGroup = data.instanceGroups[0];
    }

    this.displayName = data.defaultName;
    this.doStartVm = true;

    this.rootDiskSize = 1;
    this.keyboard = 'us';
    this.keyPair = '';
  }
}
