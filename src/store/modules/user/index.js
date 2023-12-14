import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { useTagsStore, usePermissionStore } from '@/store'
import { removeToken, toLogin } from '@/utils'
import api from '@/api'

const users = {
  admin: {
    name: '管理员(admin)',
    avatar: 'src/assets/images/adminAvatar.jpg',
    role: ['admin'],
  },
  editor: {
    name: '大脸怪(editor)',
    avatar: 'https://static.isme.top/images/avatar.jpg',
    role: ['editor'],
  },
  guest: {
    name: '顾客(guest)',
    avatar: 'src/assets/images/guestAvatar.jpg',
    role: ['guest'],
  },
}

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: {},
    }
  },
  getters: {
    userId() {
      return this.userInfo?.id
    },
    name() {
      return this.userInfo?.name
    },
    avatar() {
      return this.userInfo?.avatar
    },
    role() {
      return this.userInfo?.role || []
    },
  },
  actions: {
    async getUserInfo(token) {
      try {
        let id = 99999
        //如果token是数字，就当做id来处理
        if (!isNaN(token)) {
          id = token
          token = 'guest'
        }
        const res = users[token]
        const { name, avatar, role } = res
        this.userInfo = { id, name, avatar, role }
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async logout() {
      const { resetTags } = useTagsStore()
      const { resetPermission } = usePermissionStore()
      removeToken()
      resetTags()
      resetPermission()
      resetRouter()
      this.$reset()
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
