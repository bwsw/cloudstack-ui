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

export function navigationPredicate(order: Array<SidebarRoute>) {
  return (a: NavigationItem, b: NavigationItem) =>
    order.findIndex(_ => _.id === a.id) - order.findIndex(_ => _.id === b.id);
}

export function validateNavigationOrder(order: any): boolean {
  if (
    typeof order === 'undefined' ||
    !Array.isArray(order) ||
    order.length !== sideBarRoutes.length
  ) {
    return false;
  }

  return order.every(
    _ =>
      _.enabled != null &&
      _.id != null &&
      !!sideBarRoutes.find(route => route.id === _.id)
  );
}

export const sideBarRoutes: Array<SidebarRoute> = [
  {
    path: '/instances',
    text: 'NAVIGATION_SIDEBAR.VMS',
    icon: 'cloud',
    id: 'VMS',
    enabled: true
  },
  {
    path: '/storage',
    text: 'NAVIGATION_SIDEBAR.STORAGE',
    icon: 'dns',
    id: 'VOLUMES',
    enabled: true
  },
  {
    path: '/templates',
    text: 'NAVIGATION_SIDEBAR.IMAGES',
    icon: 'disc',
    className: 'disc-icon',
    id: 'TEMPLATES',
    enabled: true
  },
  {
    path: '/sg-templates',
    text: 'NAVIGATION_SIDEBAR.FIREWALL_TEMPLATES',
    icon: 'security',
    id: 'SGS',
    enabled: true
  },
  {
    path: '/events',
    text: 'NAVIGATION_SIDEBAR.ACTIVITY_LOG',
    icon: 'event_note',
    id: 'EVENTS',
    enabled: true
  },
  {
    path: '/ssh-keys',
    text: 'NAVIGATION_SIDEBAR.SSH_KEYS',
    icon: 'vpn_key',
    id: 'SSH',
    enabled: true
  },
  {
    path: '/settings',
    text: 'NAVIGATION_SIDEBAR.SETTINGS',
    icon: 'settings',
    id: 'SETTINGS',
    enabled: true
  }
];

export const nonDraggableRoutes: Array<SidebarRoute> = [
  {
    path: '/logout',
    text: 'NAVIGATION_SIDEBAR.LOGOUT',
    icon: 'exit_to_app',
    id: 'LOGOUT',
    enabled: true
  }
];
