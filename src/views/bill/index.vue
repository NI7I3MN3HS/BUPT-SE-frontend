<template>
  <CommonPage show-footer title="巴普特酒店账单">
    <template #action>
      <div>
        <n-button type="primary" secondary @click="handleExport">
          <TheIcon icon="mdi:download" :size="18" class="mr-5" />
          导出为图片
        </n-button>

        <n-button type="primary" @click="handleExportToExcel">
          <TheIcon icon="mdi:file-excel" :size="18" class="mr-5" />
          导出为Excel
        </n-button>
      </div>
    </template>
    <QueryBar mb-30 @search="handleSearch" @reset="handleReset">
      <QueryBarItem label="房间号" :label-width="50">
        <n-input
          v-model:value="queryItems.room_id"
          type="text"
          placeholder="请输入房间号"
          @keypress.enter="handleSearch"
        />
      </QueryBarItem>
    </QueryBar>
    <n-space justify="center">
      <n-list bordered style="min-width: 600px" id="bill-container">
        <template #header>
          <div style="font-weight: bolder; font-size: 32px">巴普特酒店</div>
        </template>
        <template #footer>带给你温馨每一天</template>
        <n-list-item>
          <n-thing>
            <span style="font-weight: bolder">账单号:</span>
            <span>{{ tableData[0]?.bill_id }}</span>
            <br />
            <span style="font-weight: bolder">房间号:</span>
            <span>{{ tableData[0]?.room_id }}</span>
            <br />
            <span style="font-weight: bolder">总计:</span>
            <span>{{ tableData[0]?.total_cost }}</span>
            <br />
          </n-thing>
        </n-list-item>
        <n-list-item>
          <n-thing>
            <span style="font-weight: bolder">入住时间:</span>
            <span>{{ tableData[0]?.checkin_time }}</span>
            <br />
            <span style="font-weight: bolder">退房时间:</span>
            <span>{{ tableData[0]?.checkout_time }}</span>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-space>
  </CommonPage>
</template>

<script setup>
import api from './api'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import { formatDateTime, renderIcon, isNullOrUndef } from '@/utils'

defineOptions({ name: 'BillList' })

const $table = ref(null)
/** 表格数据，触发搜索的时候会更新这个值 */
const tableData = ref([])
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/** 补充参数（可选） */
const extraParams = ref({})

onActivated(() => {
  handleSearch()
})

async function handleSearch() {
  if (!queryItems.value.room_id) {
    return
  }
  try {
    const data = await api.getBill(queryItems.value.room_id)
    tableData.value = data
    tableData.value.forEach((item) => {
      item.checkin_time = formatDateTime(item.checkin_time)
      item.checkout_time = formatDateTime(item.checkout_time)
    })
  } catch (error) {
    console.error('Error in handleSearch:', error)
  }
}

async function handleReset() {
  console.log('reset')
  //清空搜索条件
  queryItems.value.room_id = ''
  tableData.value = []
  handleSearch()
}

async function handleExport() {
  const element = document.getElementById('bill-container') // 确保你有一个ID对应的DOM元素
  if (element) {
    const canvas = await html2canvas(element)
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'bill.png'
    link.href = image
    link.click()
  }
}

async function handleExportToExcel() {
  if (tableData.value.length === 0) {
    console.error('No data to export')
    return
  }

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(tableData.value)

  // 创建工作簿并添加工作表
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Bill Data')

  // 生成 Excel 文件并下载
  XLSX.writeFile(wb, `房间${queryItems.value.room_id}账单.xlsx`)
}
</script>
