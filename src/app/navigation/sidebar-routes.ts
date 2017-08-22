export interface NavigationItem {
  id: string;
  enabled: boolean;
}

export interface SidebarRoute extends NavigationItem {
  path: string;
  text: string;
  icon: string;
  className?: string;
}

export function navigationPredicate(order) {
  return (a, b) => order.indexOf(a.id) - order.indexOf(b.id);
}

export function validateNavigationOrder(order: any): boolean {
  if (
    typeof order === 'undefined' ||
    !Array.isArray(order) ||
    order.length !== sideBarRoutes.length
  ) {
    return false;
  }

  return order.every(_ =>
    _.enabled != null &&
    _.id != null &&
    !!sideBarRoutes.find(route => route.id === _.id)
  );
}


export const sideBarRoutes: Array<SidebarRoute> = [
  {
    path: '/instances',
    text: 'VM_NAVBAR',
    icon: 'cloud',
    id: 'VMS',
    enabled: true
  },
  {
    path: '/spare-drives',
    text: 'SPARE_DRIVES_NAVBAR',
    icon: 'dns',
    id: 'VOLUMES',
    enabled: true
  },
  {
    path: '/templates',
    text: 'IMAGES',
    icon: 'disc',
    className: 'disc-icon',
    id: 'TEMPLATES',
    enabled: true
  },
  {
    path: '/sg-templates',
    text: 'FIREWALL',
    icon: 'security',
    id: 'SGS',
    enabled: true
  },
  {
    path: '/events',
    text: 'ACTIVITY_LOG',
    icon: 'event_note',
    id: 'EVENTS',
    enabled: true
  },
  {
    path: '/ssh-keys',
    text: 'SSH_KEYS',
    icon: 'vpn_key',
    id: 'SSH',
    enabled: true
  },
  {
    path: '/settings',
    text: 'SETTINGS',
    icon: 'settings',
    id: 'SETTINGS',
    enabled: true
  }
];

export const nonDraggableRoutes: Array<SidebarRoute> = [
  {
    path: '/logout',
    text: 'LOGOUT',
    icon: 'exit_to_app',
    id: 'LOGOUT',
    enabled: true
  }
];
