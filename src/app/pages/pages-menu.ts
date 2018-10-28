import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Accounts',
    icon: 'ion-clipboard',
    children: [
      {
        title: 'Sales',
        link: '/pages/accounts/sales/sales-dashboard',
      }, 
      {
        title: 'Purchases',
        link: '/pages/accounts/purchases',
      }, 
      {
        title: 'Inventory',
        link: '/pages/accounts/chart',
      },
    ] 
  },
  {
    title: 'Maintenance',
    icon: 'ion-clipboard',
    home: true,
    children:[{
      title:'Supplier',
      link:'/pages/maintenance/supplier_list',
    },{
      title:'COA',
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
