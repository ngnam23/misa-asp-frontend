<template>
  <DialogEmployee
    :isOpen="isOpenEmployeeDialog"
    :employeeDetail="employeeDetail"
    :type="type"
    :newCode="newCode"
    :listGroupEmployees="listGroupEmployees"
    :listAccountsPayables="listAccountsPayables"
    :listAccountsReceivables="listAccountsReceivables"
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
          title="Thêm (Ctrl + 1)"
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
    <div class="flex flex-col h-[calc(100%-68px)] bg-white">
      <div class="flex flex-col pt-3 pb-2 px-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div class="pt-2 px-3"><div class="icon-arrow-check-all"></div></div>
            <ms-select
              label="Thực hiện hàng loạt"
              :options="batchActionOptions"
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
              @click="handleActionHead(item)"
            >
              <div
                :class="[item.icon, 'cursor-pointer', actionHeadIndex === index ? 'active' : '']"
                @mouseenter="actionHeadIndex = index"
                @mouseleave="actionHeadIndex = null"
              ></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-x-2 flex-wrap mt-2">
          <div v-if="unitCode" class="flex gap-x-1 items-center text-[#0075c0] font-normal">
            <span>{{ unitCode }}</span>
            <div class="icon-close-small" @click="unitCode = ''"></div>
          </div>

          <div v-if="contactTitle" class="flex gap-x-1 items-center text-[#0075c0] font-normal">
            <span>{{ contactTitle }}</span>
            <div class="icon-close-small" @click="contactTitle = ''"></div>
          </div>

          <div v-if="gender !== -1" class="flex gap-x-1 items-center text-[#0075c0] font-normal">
            <span>{{ gender === 1 ? 'Nam' : 'Nữ' }}</span>
            <div class="icon-close-small" @click="gender = -1"></div>
          </div>

          <div v-if="isActive !== -1" class="flex gap-x-1 items-center text-[#0075c0] font-normal">
            <span>{{ isActive === 1 ? 'Đang sử dụng' : 'Ngừng sử dụng' }}</span>
            <div class="icon-close-small" @click="isActive = -1"></div>
          </div>

          <div
            v-if="
              unitCode ||
              contactTitle ||
              (gender !== -1 && gender !== null) ||
              (isActive !== -1 && isActive !== null)
            "
            class="text-[#0075c0] cursor-pointer hover:underline"
            @click="handleResetAllFilters"
          >
            Xóa điều kiện lọc
          </div>
        </div>
      </div>
      <div class="flex-1 w-full px-4 overflow-x-auto">
        <!-- h-[calc(100%-56px)] -->
        <div class="min-w-full h-full overflow-x-auto">
          <div class="h-[calc(100%-42px)] overflow-y-auto">
            <ms-table
              :fields="fields.filter((field) => field.display)"
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
                    :options="getRowOptions(row)"
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
  <DrawerCustomColumn
    :isOpen="isOpenCustomColumnDrawer"
    @close="isOpenCustomColumnDrawer = false"
  />
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import MsSelect from '@/components/ms-select/MsSelect.vue'
import MsTable from '@/components/ms-table/MsTable.vue'
import MsSelectOption from '@/components/ms-select/MsSelectOption.vue'
import PaginationTable from './_components/PaginationTable.vue'
import ModalFilter from './_components/ModalFilter.vue'
import RowSelectBtn from './_components/RowSelectBtn.vue'
import DialogEmployee from './_components/DialogEmployee.vue'
import { PAGE_SIZE_OPTIONS } from '@/constants/common'
import { useEmployeeTable } from '@/composables/useEmployeeTable'
import { useEmployeeDialog } from '@/composables/useEmployeeDialog'
import { useEmployeeActions } from '@/composables/useEmployeeActions'
import DrawerCustomColumn from './_components/DrawerCustomColumn.vue'

const listActionHead = [
  { label: 'Lấy lại dữ liệu', icon: 'icon-refresh', type: 'refresh' },
  { label: 'Xuất ra Excel', icon: 'icon-excel', type: 'export' },
  { label: 'Tùy chỉnh giao diện', icon: 'icon-setting', type: 'setting' },
]

const batchActionOptions = [
  { label: 'Xóa hàng loạt', value: 'deleteAll' },
  { label: 'Sử dụng hàng loạt', value: 'activeAll' },
  { label: 'Ngừng sử dụng hàng loạt', value: 'unActiveAll' },
]

const getRowOptions = (row) => [
  { label: 'Nhân bản', value: 'double' },
  { label: 'Xóa', value: 'delete' },
  { label: row.isActive ? 'Ngừng sử dụng' : 'Sử dụng', value: 'toggleStatus' },
]

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
  fields,
  getData,
  updateRouterQuery,
  debounceGetData,
  handleExport,
  handleFilter,
} = useEmployeeTable()

const {
  isOpenEmployeeDialog,
  employeeDetail,
  type,
  newCode,
  listGroupEmployees,
  listAccountsPayables,
  listAccountsReceivables,
  handleOpenDialogCreate,
  handleOpenDialogToUpdate,
  handleOpenDialogToDouble,
  handleSaveAndAdd,
  getMasterData,
} = useEmployeeDialog()

const isOpenCustomColumnDrawer = ref(false)

const selectedIdsArray = ref([])
const actionHeadIndex = ref(null)

const handleSelectedIds = (selectedIds) => {
  selectedIdsArray.value = selectedIds
}

const { handleActionAll, handleRowSelect } = useEmployeeActions(
  rows,
  selectedIdsArray,
  getData,
  handleOpenDialogToDouble,
)

const handleActionHead = (item) => {
  switch (item.type) {
    case 'refresh':
      getData()
      break
    case 'export':
      handleExport()
      break
    case 'setting':
      handleSetting()
      break
  }
}

const handleSetting = () => {
  isOpenCustomColumnDrawer.value = true
}

const handleResetAllFilters = () => {
  unitCode.value = ''
  contactTitle.value = ''
  gender.value = -1
  isActive.value = -1
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

const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === '1') {
    event.preventDefault()
    handleOpenDialogCreate()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  nextTick(() => {
    getData()
    getMasterData()
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
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
