export interface NavigationItem {
  id: string;
  visible: boolean;
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
    visible: true
  },
  {
    path: '/storage',
    text: 'NAVIGATION_SIDEBAR.STORAGE',
    icon: 'mdi-server',
    id: 'VOLUMES',
    visible: true
  },
  {
    path: '/templates',
    text: 'NAVIGATION_SIDEBAR.IMAGES',
    icon: 'mdi-disk',
    id: 'TEMPLATES',
    visible: true
  },  {
    path: '/snapshots',
    text: 'NAVIGATION_SIDEBAR.SNAPSHOTS',
    icon: 'mdi-camera',
    id: 'SNAPSHOTS',
    visible: true
  },
  {
    path: '/security-group',
    text: 'NAVIGATION_SIDEBAR.FIREWALL_TEMPLATES',
    icon: 'mdi-security',
    id: 'SGS',
    visible: true
  },
  {
    path: '/events',
    text: 'NAVIGATION_SIDEBAR.ACTIVITY_LOG',
    icon: 'mdi-calendar-text',
    id: 'EVENTS',
    visible: true
  },
  {
    path: '/ssh-keys',
    text: 'NAVIGATION_SIDEBAR.SSH_KEYS',
    icon: 'mdi-key',
    id: 'SSH',
    visible: true
  },
  {
    path: '/accounts',
    text: 'NAVIGATION_SIDEBAR.ACCOUNTS',
    icon: 'mdi-account',
    id: 'ACCOUNTS',
    visible: true
  },
  {
    path: '/settings',
    text: 'NAVIGATION_SIDEBAR.SETTINGS',
    icon: 'mdi-settings',
    id: 'SETTINGS',
    visible: true
  }
];

export const nonDraggableRoutes: Array<SidenavRoute> = [
  {
    path: '/logout',
    text: 'NAVIGATION_SIDEBAR.LOGOUT',
    icon: 'mdi-exit-to-app',
    id: 'LOGOUT',
    visible: true
  }
];
