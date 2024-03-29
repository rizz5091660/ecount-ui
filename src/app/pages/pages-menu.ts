import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Accounts',
    icon: 'ion-clipboard',
    children: [
      {
        title: 'Sales',
        link: '/pages/accounts/sales/sales-search',
      },
      {
        title: 'Purchase',
        link: '/pages/accounts/purchase/purchase-search',
      },
      {
        title: 'Products & Services',
        link: '/pages/accounts/inventory/inventory-search',
      },
    ]
  },
  {
    title: 'Maintenance',
    icon: 'ion-clipboard',
    home: true,
    children:[{
      title:'Contact',
      link:'/pages/maintenance/contact',
    },{
      title:'Accounting',
      link:'/pages/maintenance/coa',
    },
  ]
  },

  {
    title: 'Auth',
    icon: 'nb-locked',
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
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
