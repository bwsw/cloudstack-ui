export interface NavigationItem {
  id: string;
  enabled: boolean;
}

export interface SidenavRoute extends NavigationItem {
  path: string;
  text: string;
  icon: string;
}

export const sidenavRoutes: Array<SidenavRoute> = [
  {
    path: '/instances',
    text: 'NAVIGATION_SIDEBAR.VMS',
    icon: 'mdi-cloud',
    id: 'VMS',
    enabled: true
  },
  {
    path: '/storage',
    text: 'NAVIGATION_SIDEBAR.STORAGE',
    icon: 'mdi-server',
    id: 'VOLUMES',
    enabled: true
  },
  {
    path: '/templates',
    text: 'NAVIGATION_SIDEBAR.IMAGES',
    icon: 'mdi-disk',
    id: 'TEMPLATES',
    enabled: true
  },  {
    path: '/snapshots',
    text: 'NAVIGATION_SIDEBAR.SNAPSHOTS',
    icon: 'mdi-camera',
    id: 'SNAPSHOTS',
    enabled: true
  },
  {
    path: '/security-group',
    text: 'NAVIGATION_SIDEBAR.FIREWALL_TEMPLATES',
    icon: 'mdi-security',
    id: 'SGS',
    enabled: true
  },
  {
    path: '/events',
    text: 'NAVIGATION_SIDEBAR.ACTIVITY_LOG',
    icon: 'mdi-calendar-text',
    id: 'EVENTS',
    enabled: true
  },
  {
    path: '/ssh-keys',
    text: 'NAVIGATION_SIDEBAR.SSH_KEYS',
    icon: 'mdi-key',
    id: 'SSH',
    enabled: true
  },
  {
    path: '/accounts',
    text: 'NAVIGATION_SIDEBAR.ACCOUNTS',
    icon: 'mdi-account',
    id: 'ACCOUNTS',
    enabled: true
  },
  {
    path: '/settings',
    text: 'NAVIGATION_SIDEBAR.SETTINGS',
    icon: 'mdi-settings',
    id: 'SETTINGS',
    enabled: true
  }
];

export const nonDraggableRoutes: Array<SidenavRoute> = [
  {
    path: '/logout',
    text: 'NAVIGATION_SIDEBAR.LOGOUT',
    icon: 'mdi-exit-to-app',
    id: 'LOGOUT',
    enabled: true
  }
];
