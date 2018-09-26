import { SidenavConfigElement } from './sidenav-config-element.interface';
import {
  ComputeOfferingClass,
  OfferingCompatibilityPolicy,
  ServiceOfferingAvailability
} from '../../../shared/models/config';
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
    webShell: boolean,
    pulse: boolean
  };
  /*
   * Virtual machines settings
   */
  vmColors: Array<{ value: string }>;
  /*
   * Firewall (Security groups) settings
   */
  securityGroupTemplates: Array<any>;
  /*
   * Images settings
   */
  imageGroups: Array<any>;
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
  diskOfferingParameters: Array<any>;
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
}

export interface Config extends CustomizableConfig, NonCustomizableConfig {
}
