// tslint:disable-next-line
import { CustomServiceOffering } from '../../../service-offering/custom-service-offering/custom-service-offering.component';
import { DiskOffering, InstanceGroup, ServiceOffering, Zone } from '../../../shared/models';
import { BaseTemplateModel } from '../../../template/shared';
import { UtilsService } from '../../../shared/services/utils.service';
import { ServiceLocator } from '../../../shared/services/service-locator';
import { Rules } from '../../../security-group/sg-creation/sg-creation.component';
import { Observable } from 'rxjs/Observable';
import { VmService } from '../../shared/vm.service';
import { AuthService } from '../../../shared/services';


export class VmCreationState {
  public affinityGroupId: string;
  public affinityGroupName: string;
  public customServiceOffering: CustomServiceOffering;
  public defaultName: string;
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

  constructor() {
    this.auth = ServiceLocator.injector.get(AuthService);
    this.utils = ServiceLocator.injector.get(UtilsService);
    this.vmService = ServiceLocator.injector.get(VmService);

    this.affinityGroupId = '';
    this.rootDiskSize = 1;
    this.doStartVm = true;
    this.keyboard = 'us';
    this.keyPair = '';

    this.setDefaultVmName();
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
      this.setMinDiskSize();
    } else {
      // this.enoughResources = false;
    }
  }

  public setDefaultVmName(): void {
    this.getDefaultVmName()
      .subscribe(defaultName => {
        this.defaultName = defaultName;
        if (!this.displayName) {
          this.displayName = defaultName;
        }
      });
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

  private getDefaultVmName(): Observable<string> {
    return this.vmService.getNumberOfVms()
      .map(numberOfVms => {
        return `vm-${this.auth.username}-${numberOfVms + 1}`;
      });
  }
}
