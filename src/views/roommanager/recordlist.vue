<template>
  <CommonPage show-footer title="详单">
    <template #action>
      <div>
        <n-button
          type="primary"
          @click="
            $table?.handleExport(columns, tableData, `房间${this.$route.params.room_id}详单.xlsx`)
          "
        >
          <TheIcon icon="mdi:download" :size="18" class="mr-5" />
          导出
        </n-button>
      </div>
    </template>

    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :extra-params="extraParams"
      :scroll-x="1200"
      :columns="columns"
      :get-data="() => api.getRecords(this.$route.params.room_id ? this.$route.params.room_id : -1)"
      @on-checked="onChecked"
      @on-data-change="(data) => (tableData = data)"
    ></CrudTable>
  </CommonPage>
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import { formatDateTime, renderIcon, isNullOrUndef, formatMoney } from '@/utils'
import { useCRUD } from '@/composables'
import api from './api'

defineOptions({ name: 'RecordList' })

const $table = ref(null)
/** 表格数据，触发搜索的时候会更新这个值 */
const tableData = ref([])
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/** 补充参数（可选） */
const extraParams = ref({})

onActivated(() => {
  $table.value?.handleSearch()
})

const columns = [
  { type: 'selection', fixed: 'left' },
  { title: '房间号', key: 'room_id', width: 60, ellipsis: { tooltip: true } },
  { title: '记录编号', key: 'record_id', width: 60, ellipsis: { tooltip: true } },
  {
    title: '当前费用',
    key: 'current_cost',
    width: 60,
    ellipsis: { tooltip: true },
    render(row) {
      return h('span', formatMoney(row['current_cost']))
    },
  },
  {
    title: '费率',
    key: 'rate',
    width: 60,
    ellipsis: { tooltip: true },
  },
  { title: '风速', key: 'fan_speed', width: 60, ellipsis: { tooltip: true } },
  {
    title: '请求时间',
    key: 'request_time',
    width: 150,
    render(row) {
      return h('span', formatDateTime(row['request_time']))
    },
  },
  {
    title: '开始时间',
    key: 'start_time',
    width: 150,
    render(row) {
      return h('span', formatDateTime(row['start_time']))
    },
  },
  {
    title: '结束时间',
    key: 'end_time',
    width: 150,
    render(row) {
      return h('span', formatDateTime(row['end_time']))
    },
  },
  {
    title: '服务时长(s)',
    key: 'duration',
    width: 150,
    ellipsis: { tooltip: true },
  },
]

// 选中事件
function onChecked(rowKeys) {
  if (rowKeys.length) $message.info(`选中${rowKeys.join(' ')}`)
}
</script>
