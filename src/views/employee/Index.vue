<template>
  <DialogEmployee
    :isOpen="isOpenEmployeeDialog"
    :employeeDetail="employeeDetail"
    :type="type"
    :newCode="newCode"
    title="Thông tin nhân viên"
    @close="isOpenEmployeeDialog = false"
    @refresh="getData"
    @confirm="handleSaveAndAdd"
  />
  <div class="w-[calc(100%-196px)] bg-ef1 pl-4">
    <div class="flex justify-between mt-3 pr-3">
      <div class="text-[20px] font-semibold">Nhân viên</div>
      <div class="flex items-center h-8 gap-x-[1px]">
        <div
          class="flex items-center justify-center h-full text-white py-2 px-3 rounded-tl-[30px] rounded-bl-[30px] bg-primary cursor-pointer hover:bg-35b"
          @click="handleOpenDialogCreate"
        >
          Thêm
        </div>
        <div
          class="flex items-center justify-center h-full text-white py-2 pr-3 pl-2 rounded-tr-[30px] rounded-br-[30px] bg-primary cursor-pointer hover:bg-35b"
        >
          <div class="icon-arrow-up-white"></div>
        </div>
      </div>
    </div>
    <div class="inline-flex h-5 items-center cursor-pointer">
      <div class="icon-chevron-left"></div>
      <div class="text-[#0075c0]">Tất cả danh mục</div>
    </div>
    <div class="h-[calc(100%-68px)] bg-white">
      <div class="flex justify-between items-center py-3 px-4">
        <div class="flex items-center">
          <div class="pt-2 px-3"><div class="icon-arrow-check-all"></div></div>
          <ms-select
            label="Thực hiện hàng loạt"
            :options="[
              { label: 'Xóa hàng loạt', value: 'deleteAll' },
              { label: 'Sử dụng hàng loạt', value: 'activeAll' },
              { label: 'Ngừng sử dụng hàng loạt', value: 'unActiveAll' },
            ]"
            :disabled="selectedIdsArray.length <= 1"
            @select="handleActionAll"
          />
          <modal-filter label="Lọc" class="ml-3" @filter="handleFilter" />
        </div>
        <div class="flex items-center">
          <div class="input-wrap mr-2">
            <input
              v-model="keyword"
              type="text"
              class="pl-2.5 pr-9 border border-[#babec5] focus:border-primary rounded-[3px] outline-none w-full h-full bg-transparent"
              placeholder="Tìm theo mã, tên, số điện thoại..."
            />
            <div class="icon-input-search absolute right-2.5 top-1/2 -translate-y-1/2"></div>
          </div>
          <div
            v-for="(item, index) in listActionHead"
            :key="item.icon"
            class="px-1 flex items-center justify-center"
            :title="item.label"
          >
            <div
              :class="[item.icon, 'cursor-pointer', actionHeadIndex === index ? 'active' : '']"
              @mouseenter="actionHeadIndex = index"
              @mouseleave="actionHeadIndex = null"
            ></div>
          </div>
        </div>
      </div>
      <div class="w-full h-[calc(100%-56px)] px-4 overflow-x-auto">
        <div class="min-w-full h-full overflow-x-auto">
          <div class="h-[calc(100%-42px)] overflow-y-auto">
            <ms-table
              :fields="EMPLOYEE_FIELDS"
              :rows="rows"
              key-field="employeeID"
              @update-selected-ids="handleSelectedIds"
            >
              <template #action="{ row }">
                <div class="flex items-center justify-end px-2.5">
                  <div
                    class="text-[#0075c0] cursor-pointer py-1 px-2"
                    @click="handleOpenDialogToUpdate(row.employeeID)"
                  >
                    Sửa
                  </div>
                  <row-select-btn
                    :options="[
                      { label: 'Nhân bản', value: 'double' },
                      { label: 'Xóa', value: 'delete' },
                      {
                        label: `${row.isActive ? 'Ngừng sử dụng' : 'Sử dụng'}`,
                        value: 'toggleStatus',
                      },
                    ]"
                    @select="(option) => handleRowSelect(option, row)"
                  />
                </div>
              </template>
            </ms-table>
          </div>
          <div class="flex items-center py-2 justify-between">
            <span class="font-normal"
              >Tổng số: <span class="font-bold">{{ totalItems }}</span> bản ghi</span
            >
            <div class="flex gap-x-4">
              <ms-select-option v-model="pageSize" :options="PAGE_SIZE_OPTIONS" />
              <PaginationTable v-model="page" :total-items="totalItems" :page-size="pageSize" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MsSelect from '@/components/ms-select/MsSelect.vue'
import MsTable from '@/components/ms-table/MsTable.vue'
import { nextTick, onMounted, ref, watch } from 'vue'
import { EMPLOYEE_FIELDS, PAGE_SIZE_OPTIONS } from '@/constants/common'
import MsSelectOption from '@/components/ms-select/MsSelectOption.vue'
import PaginationTable from './_components/PaginationTable.vue'
import ModalFilter from './_components/ModalFilter.vue'
import { useEmployeeTable } from '@/composables/useEmployeeTable'
import { useConfirm } from 'primevue/useconfirm'
import http from '@/utils/http'
import { listApi } from '@/constants/list-api'
import { useToast } from 'primevue/usetoast'
import RowSelectBtn from './_components/RowSelectBtn.vue'
import DialogEmployee from './_components/DialogEmployee.vue'

const confirm = useConfirm()
const toast = useToast()

const isOpenEmployeeDialog = ref(false)

const {
  rows,
  totalItems,
  page,
  pageSize,
  keyword,
  contactTitle,
  isActive,
  gender,
  unitCode,
  getData,
  updateRouterQuery,
  debounceGetData,
  handleFilter,
} = useEmployeeTable()

const selectedIdsArray = ref([])

const listActionHead = [
  {
    label: 'Lấy lại dữ liệu',
    icon: 'icon-refresh',
  },
  {
    label: 'Xuất ra Excel',
    icon: 'icon-excel',
  },
  {
    label: 'Tùy chỉnh giao diện',
    icon: 'icon-setting',
  },
]
const actionHeadIndex = ref(null)

const handleSelectedIds = (selectedIds) => {
  selectedIdsArray.value = selectedIds
}

const handleActionAll = (action) => {
  const itemMap = new Map(rows.value.map((item) => [item.employeeID, item.employeeCode]))

  const labels = selectedIdsArray.value.map((id) => itemMap.get(id)).filter(Boolean)

  confirm.require({
    group: 'confirm-dialog',
    message: `Bạn có thực sự muốn ${action.label.toLowerCase()} Nhân viên <${labels.join(', ')}> không?`,
    icon: 'icon-exclamation-warning',
    acceptLabel: 'Có',
    rejectLabel: 'Không',
    acceptClass:
      '!h-[30px] !px-4 !text-white !text-[13px] !bg-primary hover:!bg-[#35bf22] !rounded-[3px] !border-transparent',
    rejectClass:
      '!h-[30px] !px-4 !rounded-[3px] !text-[13px] !bg-white hover:!bg-[#d2d3d6] !border !border-[#8d9096] !text-111',
    accept: () => {
      if (action.value === 'deleteAll') {
        handleDeleteEmployee(selectedIdsArray.value)
      } else if (action.value === 'activeAll') {
        handleChangeStatusEmployee(1, selectedIdsArray.value)
      } else if (action.value === 'unActiveAll') {
        handleChangeStatusEmployee(0, selectedIdsArray.value)
      }
    },
  })
}

const handleDeleteEmployee = async (ids) => {
  const idString = typeof ids === 'string' ? ids : ids.join(',')
  try {
    const response = await http.delete(listApi.Employees, { data: idString })
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã xóa thành công',
        life: 3000,
        position: 'top-center',
      })
      getData()
    }
  } catch (error) {
    console.error('Error:', error)
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message || 'Đã xảy ra lỗi',
      life: 3000,
      position: 'top-center',
    })
  }
}

const getNewCode = async () => {
  try {
    const response = await http.get(listApi.NewCode)
    if (response.success) {
      return response.data
    }
  } catch (error) {
    return ''
  }
}

const handleChangeStatusEmployee = async (status, ids) => {
  const idString = typeof ids === 'string' ? ids : ids.join(',')
  try {
    const response = await http.put(listApi.ChangeStatus, { status, ids: idString })
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã thay đổi trạng thái thành công',
        life: 3000,
        position: 'top-center',
      })
      getData()
    }
  } catch (error) {
    console.error('Error:', error)
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message || 'Đã xảy ra lỗi',
      life: 3000,
      position: 'top-center',
    })
  }
}

const handleRowSelect = (option, row) => {
  if (option.value === 'delete') {
    confirm.require({
      group: 'confirm-dialog',
      message: `Bạn có thực sự muốn xóa Nhân viên <${row.employeeCode}> không?`,
      icon: 'icon-exclamation-warning',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      acceptClass:
        '!h-[30px] !px-4 !text-white !text-[13px] !bg-primary hover:!bg-[#35bf22] !rounded-[3px] !border-transparent',
      rejectClass:
        '!h-[30px] !px-4 !rounded-[3px] !text-[13px] !bg-white hover:!bg-[#d2d3d6] !border !border-[#8d9096] !text-111',
      accept: () => {
        handleDeleteEmployee([row.employeeID])
      },
    })
  } else if (option.value === 'toggleStatus') {
    handleChangeStatusEmployee(row.isActive ? 0 : 1, [row.employeeID])
  } else if (option.value === 'double') {
    handleOpenDialogToDouble(row.employeeID)
  }
}

const handleSaveAndAdd = async () => {
  newCode.value = await getNewCode()
  type.value = 'create'
}

const handleOpenDialogCreate = async () => {
  newCode.value = await getNewCode()
  type.value = 'create'
  isOpenEmployeeDialog.value = true
}

const employeeDetail = ref(null)
const type = ref('create')
const newCode = ref('')

const handleOpenDialogToUpdate = async (employeeID) => {
  await getEmployeeDetail(employeeID)
  type.value = 'update'
  isOpenEmployeeDialog.value = true
}

const handleOpenDialogToDouble = async (employeeID) => {
  await getEmployeeDetail(employeeID)
  newCode.value = await getNewCode()
  type.value = 'double'
  isOpenEmployeeDialog.value = true
}

const getEmployeeDetail = async (employeeID) => {
  try {
    const response = await http.get(`${listApi.Employees}/${employeeID}`)
    if (response.success) {
      employeeDetail.value = response.data
    }
  } catch (error) {
    employeeDetail.value = null
  }
}

watch(
  [page, contactTitle, isActive, gender, unitCode],
  () => {
    updateRouterQuery()
    getData()
  },
  { deep: true },
)

watch(pageSize, () => {
  if (page.value === 1) {
    updateRouterQuery()
    getData()
  } else {
    page.value = 1
  }
})

watch(keyword, () => {
  debounceGetData()
})

onMounted(() => {
  nextTick(() => {
    getData()
  })
})
</script>

<style scoped lang="scss">
.input-wrap {
  position: relative;
  width: 200px;
  height: 32px;
  color: #111111;
  font-weight: 400;

  & input::placeholder {
    font-size: 12px;
    font-style: italic;
    font-weight: 300;
  }
}
::-webkit-scrollbar:vertical {
  display: none;
}
</style>
