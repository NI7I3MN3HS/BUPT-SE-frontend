import { request, requestBackend } from '@/utils'

export default {
  getBill: (room_id) => requestBackend.get(`/admin/bills/${room_id}`),
}
