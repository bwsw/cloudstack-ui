import { SidenavConfigElement } from './sidenav-config-element.interface';
import { OfferingAvailability, OfferingCompatibilityPolicy } from '../../../shared/models/config';
import { CustomComputeOfferingParams } from './custom-compute-offering-params.interface';
import {
  CustomComputeOfferingRestrictions,
  DefaultCustomComputeOfferingRestrictions
} from './compute-offering-restrictions.interface';

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
  templateGroups: Array<any>;
  /*
   * User app settings
   */
  defaultFirstDayOfWeek: number;
  defaultInterfaceLanguage: string;
  defaultTimeFormat: string;
  defaultThemeName: string;
  sessionTimeout: number;
  /*
   * Menu settings
   */
  allowReorderingSidebar: boolean;
  configureSidenav: SidenavConfigElement[];
  /*
   * Service offering setting
   */
  customComputeOfferingRestrictions: CustomComputeOfferingRestrictions[];
  defaultServiceOfferingConfig: any;
  offeringCompatibilityPolicy: OfferingCompatibilityPolicy;
  serviceOfferingClasses: Array<any>;
  diskOfferingParameters: Array<any>;
  offeringAvailability: OfferingAvailability;
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
  customComputeOfferingParams: CustomComputeOfferingParams;
  defaultCustomComputeOfferingRestrictions: DefaultCustomComputeOfferingRestrictions;
}

export interface Config extends CustomizableConfig, NonCustomizableConfig {
}
