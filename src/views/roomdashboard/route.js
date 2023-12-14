const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Roomdashboard',
  path: '/',
  component: Layout,
  redirect: '/roomdashboard',
  meta: {
    order: 0,
    role: ['guest'],
    requireAuth: true,
  },
  children: [
    {
      name: 'RoomDashBoard',
      path: 'roomdashboard',
      component: () => import('./index.vue'),
      meta: {
        title: '房间面板',
        icon: 'mdi:home',
        keepAlive: true,
      },
    },
  ],
}
