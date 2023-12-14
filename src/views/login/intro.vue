<template>
  <div class="Header">
    <n-space justify="space-between">
      <div class="HotelName">巴普特廉价酒店</div>
      <n-config-provider>
        <n-button h-72 text-17 py-29 px-80 type="primary" :loading="loading" @click="toCheckIn">
          入住
        </n-button>
      </n-config-provider>
    </n-space>
  </div>
  <div class="MainBody">
    <n-space vertical align="center" size="large">
      <div class="Intro1">探索精彩，不必高消费。</div>
      <div class="Intro2">巴普特廉价酒店，您的理想住宿伴侣。</div>
      <n-config-provider>
        <n-button
          h-50
          w-full
          rounded-5
          text-17
          p-28
          type="primary"
          :loading="loading"
          @click="toCheckIn"
        >
          即刻开始你的优质体验
        </n-button>
      </n-config-provider>
    </n-space>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const toCheckIn = () => {
  router.push('/login')
}
</script>

<style scoped>
.Header {
  height: 72px;
  justify-content: center;
}
.HotelName {
  font-size: 36px;
  color: #262626;
  line-height: 1;
  padding-bottom: 10px;
  padding-top: 10px;
  padding-left: 20px;
}
.CheckIn {
  height: 72px;
  font-size: 17px;
  padding: 29px 80px 29px 80px;
}
.CheckIn2 {
  font-size: 17px;
  padding: 28px;
}
.MainBody {
  background-image: url('@/assets/images/homepage.jpeg');
  width: 100%;
  height: 100%;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.Intro1 {
  font-size: 55px;
  color: #ffffff;
}
.Intro2 {
  font-size: 24px;
  color: #ffffff;
}
</style>
