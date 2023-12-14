import { request, requestBackend } from '@/utils'

export default {
  getPosts: (params = {}) => request.get('posts', { params }),
  getPostById: (id) => request.get(`/post/${id}`),
  addPost: (data) => request.post('/post', data),
  updatePost: (data) => request.put(`/post/${data.id}`, data),
  deletePost: (id) => request.delete(`/post/${id}`),

  //房间管理
  addRoom: (data) =>
    requestBackend.post(
      '/admin/create',
      {},
      {
        params: {
          room_id: data.room_id,
          identity_card: data.identity_card,
          initial_temperature: data.initial_temperature,
        },
      }
    ),
  deleteRoom: (data) =>
    requestBackend.delete('/admin/delete', {
      params: {
        room_id: data,
      },
    }),
  getRooms: (params = {}) => {
    if (params.room_id) {
      return requestBackend.get('/admin/rooms/', { params })
    } else {
      // 否则，获取所有房间的信息
      return requestBackend.get('/admin/rooms')
    }
  },
  acOn: (data) =>
    requestBackend.post(
      '/schedule/request_on',
      {},
      {
        params: {
          room_id: data,
        },
      }
    ),
  acOff: (data) =>
    requestBackend.post(
      '/schedule/request_off',
      {},
      {
        params: {
          room_id: data,
        },
      }
    ),

  //房间详单
  getRecords: (room_id) => {
    return requestBackend.get(`/admin/records/${room_id}`)
  },
}
