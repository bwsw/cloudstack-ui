import { SidenavConfigElement } from './sidenav-config-element.interface';
import { ServiceOfferingAvailability } from './service-offering-availability.interface';
import { OfferingCompatibilityPolicy } from './offering-compatibility-policy.interface';
import { ComputeOfferingClass } from './compute-offering-class.interface';
import { ImageGroup } from './image-group.model';
import { CustomComputeOfferingHardwareValues } from './custom-compute-offering-hardware-values.interface';
import { DefaultComputeOffering } from './default-compute-offering.interface';
import { CustomComputeOfferingHardwareRestrictions } from './custom-compute-offering-hardware-restrictions.interface';
import { CustomComputeOfferingParameters } from './custom-compute-offering-parameters.interface';

export interface CustomizableConfig {
  /*
   * General
   */
  defaultDomain: string;
  sessionRefreshInterval: number;
  apiDocLink: string;
  extensions: {
    webShell: boolean;
    pulse: boolean;
  };
  /*
   * Virtual machines settings
   */
  vmColors: { value: string }[];
  /*
   * Firewall (Security groups) settings
   */
  securityGroupTemplates: any[];
  /*
   * Images settings
   */
  imageGroups: ImageGroup[];
  /*
   * User app settings
   */
  defaultFirstDayOfWeek: number;
  defaultInterfaceLanguage: string;
  defaultTimeFormat: string;
  defaultTheme: string;
  sessionTimeout: number;
  /*
   * Menu settings
   */
  allowReorderingSidenav: boolean;
  configureSidenav: SidenavConfigElement[];
  /*
   * Service offering setting
   */
  customComputeOfferingParameters: CustomComputeOfferingParameters[];
  defaultComputeOffering: DefaultComputeOffering[];
  offeringCompatibilityPolicy: OfferingCompatibilityPolicy;
  computeOfferingClasses: ComputeOfferingClass[];
  serviceOfferingAvailability: ServiceOfferingAvailability;
}

export interface NonCustomizableConfig {
  /*
   * User tags
   */
  askToCreateVM: boolean;
  askToCreateVolume: boolean;
  savePasswordForAllVMs: boolean | null;
  lastVMId: number;
  isSidenavVisible: boolean;
  showSystemTags: boolean;
  navigationOrder: string;
  /*
   * Offerings
   */
  customComputeOfferingHardwareValues: CustomComputeOfferingHardwareValues;
  defaultCustomComputeOfferingRestrictions: CustomComputeOfferingHardwareRestrictions;
  keyboardLayoutForVms: string;
}

export interface Config extends CustomizableConfig, NonCustomizableConfig {}
