import { requestBackend } from '@/utils'

export default {
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
  setTemp: (data) =>
    requestBackend.post(
      '/schedule/request_temp',
      {},
      {
        params: {
          room_id: data.room_id,
          target_temperature: data.target_temp,
        },
      }
    ),
  setWind: (data) =>
    requestBackend.post(
      '/schedule/request_speed',
      {},
      {
        params: {
          room_id: data.room_id,
          fan_speed: data.fan_speed,
        },
      }
    ),
  getRoomInfo: (data) => requestBackend.get(`/user/show/${data}`),
}
