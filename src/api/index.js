import { request } from '@/utils'

export default {
  //mock api
  getUser: () => request.get('/user'),
  refreshToken: () => request.post('/auth/refreshToken', null, { noNeedTip: true }),
}
