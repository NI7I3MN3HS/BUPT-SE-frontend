const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Billmanager',
  path: '/billmanager',
  component: Layout,
  redirect: '/billmanager/billlist',
  meta: {
    order: 1,
    role: ['admin'],
    requireAuth: true,
  },
  children: [
    {
      name: 'BillList',
      path: 'billlist',
      component: () => import('./index.vue'),
      meta: {
        title: '账单管理',
        icon: 'mdi:home',
        keepAlive: true,
      },
    },
  ],
}
