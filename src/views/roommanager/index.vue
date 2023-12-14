<template>
  <CommonPage show-footer title="房间列表">
    <template #action>
      <div>
        <n-button type="primary" secondary @click="$table?.handleExport()">
          <TheIcon icon="mdi:download" :size="18" class="mr-5" />
          导出
        </n-button>
        <n-button type="primary" class="ml-16" @click="handleAdd">
          <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />
          新增房间
        </n-button>
      </div>
    </template>

    <CrudTable
      :remote="false"
      :isPagination="false"
      ref="$table"
      v-model:query-items="queryItems"
      :extra-params="extraParams"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.getRooms"
      @on-checked="onChecked"
      @on-data-change="(data) => (tableData = data)"
    >
      <template #queryBar>
        <QueryBarItem label="房间号" :label-width="50">
          <n-input
            v-model:value="queryItems.room_id"
            type="text"
            placeholder="请输入房间号"
            @keypress.enter="$table?.handleSearch"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
    <!-- 新增/编辑/查看 -->
    <CrudModal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :loading="modalLoading"
      :show-footer="modalAction !== 'view'"
      @on-save="handleSave"
    >
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="房间号"
          path="room_id"
          :rule="{
            required: true,
            message: '请输入房间号',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.room_id" placeholder="请输入房间号" />
        </n-form-item>
        <n-form-item
          label="身份证"
          path="identity_card"
          :rule="{
            required: true,
            message: '请输入身份证号',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.identity_card" placeholder="请输入身份证号" />
        </n-form-item>
        <n-form-item
          label="初始温度"
          path="initial_temperature"
          :rule="{
            required: true,
            message: '请输入初始化温度',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.initial_temperature" placeholder="请输入初始化温度" />
        </n-form-item>
      </n-form>
    </CrudModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import { formatDateTime, renderIcon, isNullOrUndef } from '@/utils'
import { useCRUDRoom } from '@/composables'
import api from './api'
import route from '../demo/route'
import { router } from '@/router'

defineOptions({ name: 'RoomList' })

const $table = ref(null)
/** 表格数据，触发搜索的时候会更新这个值 */
const tableData = ref([])
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/** 补充参数（可选） */
const extraParams = ref({})

//从表格中获取该行的status，status值SERVING时值为true,SHUTDOWN时值为false，然后将isACon的值传入NSwitch中
function getSwitchStatus(row) {
  if (row.status === 'SHUTDOWN') {
    row.isACon = false
  } else {
    row.isACon = true
  }
}

const columns = [
  { type: 'selection', fixed: 'left' },
  {
    title: '空调开关',
    key: 'isACon',
    width: 60,
    align: 'center',
    fixed: 'left',
    render(row) {
      getSwitchStatus(row)
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: row.isACon,
        loading: !!row.isACing,
        onUpdateValue: () => handleAC(row),
      })
    },
  },
  { title: '空调状态', key: 'status', width: 80, ellipsis: { tooltip: true } },
  { title: '房间号', key: 'room_id', width: 80, ellipsis: { tooltip: true } },
  { title: '身份证', key: 'identity_card', width: 80, ellipsis: { tooltip: true } },
  { title: '初始温度', key: 'initial_temperature', width: 80 },
  { title: '当前温度', key: 'current_temperature', width: 80, ellipsis: { tooltip: true } },
  { title: '风速', key: 'fan_speed', width: 80, ellipsis: { tooltip: true } },
  { title: '服务时间', key: 'server_time', width: 80, ellipsis: { tooltip: true } },
  { title: '总花费', key: 'total_cost', width: 80, ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: 240,
    align: 'center',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 15px;',
            onClick: () => viewRecord(row),
          },
          {
            default: () => '查看详单',
            icon: renderIcon('majesticons:eye-line', { size: 14 }),
          }
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 15px;',
            onClick: () => handleDelete(row.room_id),
          },
          {
            default: () => '退房',
            icon: renderIcon('material-symbols:delete-outline', { size: 14 }),
          }
        ),
      ]
    },
  },
]

// 选中事件
function onChecked(rowKeys) {
  if (rowKeys.length) $message.info(`选中${rowKeys.join(' ')}`)
}

// 处理空调开关
function handleAC(row) {
  if (isNullOrUndef(row.room_id)) return

  row.isACing = true

  const action = row.isACon ? api.acOff : api.acOn

  action(row.room_id)
    .then(() => {
      $table.value?.handleSearch()
      row.isACing = false
      $message?.success(row.isACon ? '空调已关闭' : '空调已开启')
    })
    .catch(() => {
      row.isACing = false
      $message?.error('操作失败')
    })
}

// 查看详单:根据房间号查看详单，进入一个新的表格页面，显示该房间详单信息
function viewRecord(row) {
  if (isNullOrUndef(row.room_id)) return
  router.push({
    name: 'RecordList',
    params: { room_id: row.room_id },
  })
}

const {
  modalVisible,
  modalAction,
  modalTitle,
  modalLoading,
  handleAdd,
  handleDelete,
  handleEdit,
  handleView,
  handleSave,
  modalForm,
  modalFormRef,
} = useCRUDRoom({
  name: '房间',
  initForm: {},
  doCreate: api.addRoom,
  doDelete: api.deleteRoom,
  //doUpdate: api.updatePost,暂时不需要编辑功能
  refresh: () => $table.value?.handleSearch(),
})

onActivated(() => {
  $table.value?.handleSearch()
})
</script>
