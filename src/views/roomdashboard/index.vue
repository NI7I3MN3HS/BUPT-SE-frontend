<template>
  <AppPage :show-footer="false">
    <div class="flex">
      <n-card class="w-60%">
        <div class="flex items-center">
          <n-avatar round :size="60" :src="userStore.avatar" />
          <div class="ml-20 flex-col">
            <span class="text-20 opacity-80">Hello, 尊敬的{{ userStore.name }}</span>
            <span class="mt-4 opacity-50">欢迎来到巴普特廉价酒店</span>
          </div>
        </div>

        <p class="mt-20 text-18 opacity-80">巴普特廉价酒店，您的理想住宿伴侣。</p>
      </n-card>
      <n-card class="ml-12 w-40%">
        <div class="ml-20 flex-col items-center">
          <span class="text-5rem font-500 opacity-90">房间温度</span>
          <span class="text-12rem font-normal opacity-90">{{ roomtemp }}°</span>
        </div>
      </n-card>
    </div>
    <div class="mt-12 flex">
      <n-card title="空调面板" segmented>
        <div class="ml-20 flex-col items-center">
          <span class="text-5rem font-500 opacity-90">空调温度</span>
          <span class="text-12rem font-normal opacity-90">{{ actemp }}°</span>
          <div class="relative flex mt-20 mb-20">
            <span class="absolute-center">
              <TheIcon icon="material-symbols:ac-unit" :size="18" v-if="acon" />
            </span>
            <span class="absolute-center ml-35">
              <TheIcon
                icon="material-symbols-light:stat-1-rounded"
                :size="18"
                v-if="fanspeed === 1 && acon"
              />
              <TheIcon
                icon="material-symbols-light:stat-2-rounded"
                :size="18"
                v-if="fanspeed === 2 && acon"
              />
              <TheIcon
                icon="material-symbols-light:stat-3-rounded"
                :size="18"
                v-if="fanspeed === 3 && acon"
              />
            </span>
          </div>
          <n-slider
            class="w-50%"
            v-model:value="actemp"
            :step="1"
            :tooltip="false"
            :min="16"
            :max="30"
            @update:value="handleSlider"
            :disabled="!acon"
          />
        </div>
        <footer class="flex items-center justify-center">
          <div class="mt-20 flex-col items-center">
            <n-button class="ml-20" round @click="handleTempMinus">
              <TheIcon icon="ic:round-minus" :size="18" />
            </n-button>
          </div>
          <div class="mt-20 flex-col items-center">
            <n-button class="ml-20" round @click="handleACPower">
              <TheIcon icon="ion:md-power" :size="18" />
            </n-button>
          </div>
          <div class="mt-20 flex-col items-center">
            <n-button class="ml-20" round @click="handleFanSpeed">
              <TheIcon icon="material-symbols-light:toys-fan" :size="18" />
            </n-button>
          </div>
          <div class="mt-20 flex-col items-center">
            <n-button class="ml-20" round @click="handleTempPlus">
              <TheIcon icon="ic:round-plus" :size="18" />
            </n-button>
          </div>
        </footer>
      </n-card>

      <n-card class="ml-12" title="花费" segmented>
        <VChart :option="costChartOption" class="wh-full" autoresize />
      </n-card>
    </div>
  </AppPage>
</template>
<script setup>
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

import { useUserStore } from '@/store'
import api from './api'

defineOptions({ name: 'RoomDashBoard' })

const userStore = useUserStore()

const userid = ref(userStore.userId)

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  PieChart,
])

const roomtemp = ref(30)
const actemp = ref(25)
const fanspeed = ref(0)
const cost = ref(0)
const costHistory = ref([])

const costChartOption = ref({
  tooltip: {
    trigger: 'axis', // 'item' 对单个数据项生效，'axis' 对整个类目轴生效
    axisPointer: {
      // 指示器类型
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
    formatter: (params) => {
      // params 是一个包含当前点信息的数组，你可以根据需要格式化输出
      return `${params[0].axisValueLabel}: ${params[0].data}￥`
    },
  },
  xAxis: {
    type: 'category',
    data: [], // 这里将存储每次更新时的时间戳或其他标识符
  },
  yAxis: {
    type: 'value',
    min: 0, // Y 轴的最小值
    max: 100, // Y 轴的最大值
    interval: 20, // Y 轴每个刻度的间隔
  },
  series: [
    {
      data: costHistory.value,
      type: 'bar',
      barWidth: '10px', // 控制柱子的宽度
    },
  ],
})

// 观察 cost 的变化，并更新图表数据
watch(cost, (newCost) => {
  // 添加新的 cost 值
  costHistory.value.push(newCost)

  // 更新 xAxis 数据（例如，使用时间戳或简单的计数器）
  costChartOption.value.xAxis.data.push(new Date().toLocaleTimeString())

  // 确保数组不会无限增长（可根据需要调整）
  if (costHistory.value.length > 10) {
    costHistory.value.shift()
    costChartOption.value.xAxis.data.shift()
  }
})

const skillsOption = {
  tooltip: {
    trigger: 'item',
    formatter({ name, value }) {
      return `${name} ${value}%`
    },
  },
  legend: {
    left: 'center',
  },
  series: [
    {
      top: '7%',
      type: 'pie',
      radius: ['40%', '85%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 36,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 38.5, name: 'Vue' },
        { value: 37.0, name: 'JavaScript' },
        { value: 6.5, name: 'CSS' },
        { value: 6.2, name: 'HTML' },
        { value: 1.8, name: 'Other' },
      ],
    },
  ],
}

const acon = ref(false)

const handleACPower = async () => {
  if (!acon.value) {
    const res = await api.acOn(userid.value)
    if (res.msg === '开机成功') {
      $message.success('空调已开启')
      acon.value = !acon.value
      return
    }
  } else if (acon.value) {
    const res = await api.acOff(userid.value)
    if (res.msg === '关机成功') {
      $message.success('空调已关闭')
      acon.value = !acon.value
      return
    }
  }
}

const handleFanSpeed = () => {
  if (!acon.value) return
  fanspeed.value = fanspeed.value === 3 ? 1 : fanspeed.value + 1
  setAcFanSpeed()
}

const handleSlider = (value) => {
  if (!acon.value) return
  setAcTemp()
}

const handleTempPlus = () => {
  if (!acon.value) return
  actemp.value = actemp.value === 30 ? 30 : actemp.value + 1
  setAcTemp()
}

const handleTempMinus = () => {
  if (!acon.value) return
  actemp.value = actemp.value === 16 ? 16 : actemp.value - 1
  setAcTemp()
}

const setAcTemp = async () => {
  const res = await api.setTemp({ room_id: userid.value, target_temp: actemp.value })
  if (res.msg === '修改成功') {
    $message.success('温度设置成功')
  }
}

const setAcFanSpeed = async () => {
  //将风速数字转换为字符串
  const fanSpeedMap = {
    1: 'low',
    2: 'medium',
    3: 'high',
  }

  const res = await api.setWind({ room_id: userid.value, fan_speed: fanSpeedMap[fanspeed.value] })
  if (res.msg === '修改成功') {
    $message.success('风速设置成功')
  }
}

//更新房间信息
const updateRoomInfo = async () => {
  const fanSpeedMap = {
    high: 3,
    medium: 2,
    low: 1,
  }
  const res = await api.getRoomInfo(userid.value)
  roomtemp.value = res.current_temperature
  cost.value = res.total_cost
  fanspeed.value = res.fan_speed = fanSpeedMap[res.fan_speed]
}

let timer = null
//设置轮询，每秒更新房间信
onActivated(() => {
  timer = setInterval(updateRoomInfo, 2000)
})

onDeactivated(() => {
  clearInterval(timer)
})
</script>
