import { request, requestBackend } from '@/utils'

export default {
  login: (data) => request.post('/auth/login', data, { noNeedToken: true }),
  guestlogin: (data) =>
    requestBackend.post(
      '/user/login',
      {},
      {
        noNeedToken: true,
        params: {
          room_id: data.name,
          identity_card: data.password,
        },
      }
    ),
  adminlogin: (data) =>
    requestBackend.post(
      '/admin/login',
      {},
      {
        noNeedToken: true,
        params: {
          password: data.password,
        },
      }
    ),
}
