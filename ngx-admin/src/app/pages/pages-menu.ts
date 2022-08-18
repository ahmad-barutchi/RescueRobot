import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Robot data',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'Graphic data analyse',
        link: '/pages/charts/igniteUi',
      },
      {
        title: 'Sessions listing',
        link: '/pages/sessions',
      },
      {
        title: 'Session data table',
        link: '/pages/session-info',
      },
    ],
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
