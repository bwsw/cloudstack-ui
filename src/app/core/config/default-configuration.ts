import { Config, CustomizableConfig, NonCustomizableConfig } from '../../shared/models/config';

const COLORS = [
  { value: '#F44336' },
  { value: '#E91E63' },
  { value: '#9C27B0' },
  { value: '#673AB7' },
  { value: '#3F51B5' },
  { value: '#2196F3' },
  { value: '#03A9F4' },
  { value: '#00BCD4' },
  { value: '#009688' },
  { value: '#4CAF50' },
  { value: '#8BC34A' },
  { value: '#CDDC39' },
  { value: '#FFEB3B' },
  { value: '#FFC107' },
  { value: '#FF9800' },
  { value: '#FF5722' },
  { value: '#795548' },
  { value: '#9E9E9E' },
  { value: '#607D8B' },
  { value: '#FFEBEE' },
  { value: '#E1F5FE' },
  { value: '#E8F5E9' },
  { value: '#FFFDE7' },
  { value: '#FFF3E0' },
  { value: '#FFFFFF' },
  { value: '#ECEFF1' },
];

export const customizableProperties: Readonly<CustomizableConfig> = {
  /*
   * General
   */
  defaultDomain: '',
  sessionRefreshInterval: 60,
  apiDocLink: 'https://cloudstack.apache.org/api/apidocs-4.11/',
  extensions: {
    webShell: false,
    pulse: false,
    vmLogs: false,
  },
  /*
   * Virtual machines settings
   */
  vmColors: COLORS,
  /*
   * Firewall (Security groups) settings
   */
  securityGroupTemplates: [],
  defaultSecurityGroupName: {
    en: 'default',
    ru: 'default',
  },
  /*
  * Images settings
  */
  imageGroups: [],
  /*
   * User app settings
   */
  defaultFirstDayOfWeek: 1,
  defaultInterfaceLanguage: 'en',
  defaultTimeFormat: 'hour24',
  defaultTheme: 'blue-red',
  sessionTimeout: 30,
  /*
   * Menu settings
   */
  allowReorderingSidenav: true,
  configureSidenav: [
    { id: 'VMS', visible: true },
    { id: 'VOLUMES', visible: true },
    { id: 'TEMPLATES', visible: true },
    { id: 'SNAPSHOTS', visible: true },
    { id: 'SGS', visible: true },
    { id: 'EVENTS', visible: true },
    { id: 'SSH', visible: true },
    { id: 'ACCOUNTS', visible: true },
    { id: 'LOGS', visible: true },
    { id: 'SETTINGS', visible: true },
  ],
  /*
   * Service offering setting
   */
  customComputeOfferingParameters: [],
  defaultComputeOffering: [],
  offeringCompatibilityPolicy: {},
  computeOfferingClasses: [],
  serviceOfferingAvailability: {
    filterOfferings: false,
  },
};

export const nonCustomizableProperties: Readonly<NonCustomizableConfig> = {
  /*
   * User tags
   */
  askToCreateVM: true,
  askToCreateVolume: true,
  // null means that the user has not yet set this option.
  // The application will ask him about autosave passwords and set the value based on the user's choice.
  savePasswordForAllVMs: null,
  lastVMId: 0,
  showSystemTags: false,
  /*
   * Offerings
   */
  customComputeOfferingHardwareValues: {
    cpunumber: 1,
    cpuspeed: 1000,
    memory: 512,
  },
  defaultCustomComputeOfferingRestrictions: {
    cpunumber: {
      min: 1,
      max: Number.POSITIVE_INFINITY,
    },
    cpuspeed: {
      min: 1000,
      max: Number.POSITIVE_INFINITY,
    },
    memory: {
      min: 512,
      max: Number.POSITIVE_INFINITY,
    },
  },
  keyboardLayoutForVms: 'us',
};

export const defaultConfig: Readonly<Config> = {
  ...customizableProperties,
  ...nonCustomizableProperties,
};
