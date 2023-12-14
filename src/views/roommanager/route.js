const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Roommanager',
  path: '/',
  component: Layout,
  redirect: '/roomlist',
  meta: {
    order: 0,
    role: ['admin'],
    requireAuth: true,
  },
  children: [
    {
      name: 'RoomList',
      path: 'roomlist',
      component: () => import('./index.vue'),
      meta: {
        title: '房间管理',
        icon: 'mdi:home',
        keepAlive: true,
      },
    },
    {
      isHidden: true,
      name: 'RecordList',
      path: 'recordlist/:room_id',
      component: () => import('./recordlist.vue'),
      meta: {
        title: '房间详单',
        icon: 'mdi:file-document',
        keepAlive: true,
      },
    },
  ],
}
