import { SidenavConfigElement } from './sidenav-config-element.interface';
import { OfferingAvailability } from '../../../shared/services/offering.service';

export interface Config extends CustomizableConfig, NonCustomizableConfig {
}

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
  configureSidenav: Array<SidenavConfigElement>;
  /*
   * Service offering setting
   */
  customOfferingRestrictions: any;
  defaultServiceOfferingConfig: any;
  offeringCompatibilityPolicy: any;
  serviceOfferingClasses: Array<any>;
  diskOfferingParameters: Array<any>;
  offeringAvailability: OfferingAvailability;
}

export interface NonCustomizableConfig {
  askToCreateVM: boolean;
  askToCreateVolume: boolean;
  savePasswordForAllVMs: boolean | null;
  lastVMId: number;
  isSidenavVisible: boolean;
  showSystemTags: boolean;
  navigationOrder: string;
}
