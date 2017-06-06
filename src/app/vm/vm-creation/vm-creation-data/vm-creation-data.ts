// tslint:disable-next-line
import { CustomServiceOffering } from '../../../service-offering/custom-service-offering/custom-service-offering.component';
import { DiskOffering, InstanceGroup, ServiceOffering, Zone } from '../../../shared/models';
import { BaseTemplateModel } from '../../../template/shared';
import { UtilsService } from '../../../shared/services/utils.service';
import { ServiceLocator } from '../../../shared/services/service-locator';


export class VmCreationData {
  public affinityGroupId: string;
  public affinityGroupName: string;
  public customServiceOffering: CustomServiceOffering;
  public displayName: string;
  public doStartVm: boolean;
  public instanceGroup: InstanceGroup;
  public keyboard: string;
  public keyPair: string;
  public rootDiskSize: number;
  public rootDiskSizeMin: number;
  public rootDiskSizeLimit: number;
  public showRootDiskResize = false;
  public zone: Zone;

  private _diskOffering: DiskOffering;
  private _serviceOffering: ServiceOffering;
  private _template: BaseTemplateModel;

  private utils: UtilsService;

  constructor() {
    this.utils = ServiceLocator.injector.get(UtilsService);

    this.affinityGroupId = '';
    this.rootDiskSize = 1;
    this.rootDiskSizeMin = 1;
    this.rootDiskSizeLimit = 2;
    this.doStartVm = true;
    this.keyboard = 'us';
    this.keyPair = '';
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
    if (t && this.utils.convertToGB(t.size || 0) < this.rootDiskSizeLimit) {
      this._template = t;
      this.setMinDiskSize(t);
    } else {
      // this.enoughResources = false;
    }
  }

  private setMinDiskSize(template?: BaseTemplateModel): void {
    const t = template || this.template;
    if (!t) {
      throw new Error('Template was not passed to set disk size');
    }

    if (t.size != null) {
      const newSize = t.size / Math.pow(2, 30);
      this.rootDiskSizeMin = newSize;
      this.rootDiskSize = newSize;
    } else {
      this.rootDiskSizeMin = 1;
      this.rootDiskSize = 1;
    }
  }

  public get serviceOffering(): ServiceOffering {
    return this._serviceOffering;
  }

  public set serviceOffering(offering: ServiceOffering) {
    this._serviceOffering = offering;
    if (offering.isCustomized) {
      this.customServiceOffering = new CustomServiceOffering(
        offering.cpuNumber,
        offering.cpuSpeed,
        offering.memory
      );
    } else {
      this.customServiceOffering = null;
    }
  }
}
