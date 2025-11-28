export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  isActive?: boolean;
  badge?: {
    text: string;
    color: string;
  };
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'home',
    title: 'Inicio',
    icon: 'home-outline',
    route: '/home'
  },
  {
    id: 'profile',
    title: 'MI PERFIL',
    icon: 'person-outline',
    route: '/profile'
  },
  {
    id: 'history',
    title: 'HISTORIAL',
    icon: 'time-outline',
    route: '/history'
  },
  {
    id: 'contacts',
    title: 'GESTIÓN DE CONTACTOS',
    icon: 'people-outline',
    route: '/contacts'
  }
];

export interface FooterButton {
  id: string;
  title: string;
  icon: string;
  type: 'outline' | 'clear';
  action: 'support' | 'logout';
}

export const FOOTER_BUTTONS: FooterButton[] = [
  {
    id: 'support',
    title: 'Soporte',
    icon: 'headset-outline',
    type: 'outline',
    action: 'support'
  },
  {
    id: 'logout',
    title: 'Salir',
    icon: 'log-out-outline',
    type: 'clear',
    action: 'logout'
  }
];