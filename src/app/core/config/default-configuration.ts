import { ConfigInterface } from './config-interface';

const COLORS = [
  {
    'value': '#F44336'
  },
  {
    'value': '#E91E63'
  },
  {
    'value': '#9C27B0'
  },
  {
    'value': '#673AB7'
  },
  {
    'value': '#3F51B5'
  },
  {
    'value': '#2196F3'
  },
  {
    'value': '#03A9F4'
  },
  {
    'value': '#00BCD4'
  },
  {
    'value': '#009688'
  },
  {
    'value': '#4CAF50'
  },
  {
    'value': '#8BC34A'
  },
  {
    'value': '#CDDC39'
  },
  {
    'value': '#FFEB3B'
  },
  {
    'value': '#FFC107'
  },
  {
    'value': '#FF9800'
  },
  {
    'value': '#FF5722'
  },
  {
    'value': '#795548'
  },
  {
    'value': '#9E9E9E'
  },
  {
    'value': '#607D8B'
  },
  {
    'value': '#FFEBEE'
  },
  {
    'value': '#E1F5FE'
  },
  {
    'value': '#E8F5E9'
  },
  {
    'value': '#FFFDE7'
  },
  {
    'value': '#FFF3E0'
  },
  {
    'value': '#FFFFFF'
  },
  {
    'value': '#ECEFF1'
  }
];


export const defaultConfig: ConfigInterface = {
  /*
   * General
   */
  defaultDomain: '',
  sessionRefreshInterval: 60,
  apiDocLink: 'https://cloudstack.apache.org/api/apidocs-4.11/',
  extensions: {
    webShell: false,
    pulse: false
  },
  /*
   * Virtual machines settings
   */
  vmColors: COLORS,
  /*
   * Firewall (Security groups) settings
   */
  securityGroupTemplates: [],
  /*
  * Images settings
  */
  templateGroups: [],
  /*
   * User app settings
   */
  defaultFirstDayOfWeek: 1,
  defaultInterfaceLanguage: 'en',
  defaultTimeFormat: 'hour24',
  defaultThemeName: 'blue-red',
  sessionTimeout: 30,
  /*
   * Menu settings
   */
  allowReorderingSidebar: true,
  configureSidebar: [
    'vms',
    'volumes',
    'templates',
    'sgs',
    'events',
    'ssh',
    'accounts',
    'settings'
  ],
  /*
   * Service offering setting
   */
  customOfferingRestrictions: {},
  defaultServiceOfferingConfig: {},
  offeringCompatibilityPolicy: {},
  serviceOfferingClasses: [],
  diskOfferingParameters: [
    'displaytext',
    'disksize',
    'created',
    'storagetype',
    'provisioningtype',
    'iscustomized',
    'miniops',
    'maxiops'
  ],
  offeringAvailability: {
    'filterOfferings': false
  },
  /*
   * Non-user configurable parameters
   */
  askToCreateVM: true,
  askToCreateVolume: true,
   // null means that the user has not yet set this option.
   // The application will ask him about autosave passwords and set the value based on the user's choice.
  savePasswordForAllVMs: null,
  lastVMId: 1,
  showSystemTags: false,
  navigationOrder: ''
};
