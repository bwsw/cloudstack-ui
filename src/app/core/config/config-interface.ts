export interface ConfigInterface {
  /*
   * General
   */
  defaultDomain: string;
  sessionRefreshInterval: number;
  apiDocLink: string;
  extensions: Object;
  /*
   * Virtual machines settings
   */
  vmColors: Array<any>;
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
  sidenavList: Array<string>;
  configureSidenav: Array<{link: string, visible: boolean}>;
  /*
   * Service offering setting
   */
  customOfferingRestrictions: Object;
  defaultServiceOfferingConfig: Object;
  offeringCompatibilityPolicy: Object;
  serviceOfferingClasses: Array<any>;
  diskOfferingParameters: Array<any>;
  offeringAvailability: Object;
  /*
   * Non-user configurable parameters
   */
  askToCreateVM: boolean;
  askToCreateVolume: boolean;
  savePasswordForAllVMs: boolean | null;
  lastVMId: number;
  showSystemTags: boolean;
  navigationOrder: string;
}
