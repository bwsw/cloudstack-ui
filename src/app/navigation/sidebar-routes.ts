export interface SidebarRoute {
  path: string;
  text: string;
  icon: string;
  id: string;
  className?: string;
}

export const sideBarRoutes: Array<SidebarRoute> = [
  {
    path: '/instances',
    text: 'VM_NAVBAR',
    icon: 'cloud',
    id: 'VMS'
  },
  {
    path: '/spare-drives',
    text: 'SPARE_DRIVES_NAVBAR',
    icon: 'dns',
    id: 'VOLUMES'
  },
  {
    path: '/templates',
    text: 'IMAGES',
    icon: 'disc',
    className: 'disc-icon',
    id: 'TEMPLATES'
  },
  {
    path: '/sg-templates',
    text: 'FIREWALL',
    icon: 'security',
    id: 'SGS'
  },
  {
    path: '/events',
    text: 'ACTIVITY_LOG',
    icon: 'event_note',
    id: 'EVENTS'
  },
  {
    path: '/ssh-keys',
    text: 'SSH_KEYS',
    icon: 'vpn_key',
    id: 'SSH'
  },
  {
    path: '/settings',
    text: 'SETTINGS',
    icon: 'settings',
    id: 'SETTINGS'
  },
  {
    path: '/logout',
    text: 'LOGOUT',
    icon: 'exit_to_app',
    id: 'LOGOUT'
  }
];
