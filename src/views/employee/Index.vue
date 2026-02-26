<template>
  <div class="w-[calc(100%-196px)] bg-ef1 pl-4">
    <div class="flex justify-between mt-3 pr-3">
      <div class="text-[20px] font-semibold">Nhân viên</div>
      <div class="flex items-center h-8 gap-x-[1px]">
        <div
          class="flex items-center justify-center h-full text-white py-2 px-3 rounded-tl-[30px] rounded-bl-[30px] bg-primary cursor-pointer hover:bg-35b"
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
            :disabled="false"
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
            <ms-table :fields="EMPLOYEE_FIELDS" :rows="rows" />
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
import { listApi } from '@/constants/list-api'
import http from '@/utils/http'
import MsSelectOption from '@/components/ms-select/MsSelectOption.vue'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from '@/utils/debounce'
import PaginationTable from './_components/PaginationTable.vue'
import ModalFilter from './_components/ModalFilter.vue'

const router = useRouter()
const route = useRoute()

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
const rows = ref([])
const totalItems = ref(0)
const page = ref(parseInt(route.query.page) || 1)
const pageSize = ref(parseInt(route.query.pageSize) || 20)
const keyword = ref(route.query.keyword || '')
const contactTitle = ref(route.query.contactTitle || '')
const isActive = ref(+route.query.isActive === 0 ? 0 : +route.query.isActive || -1)
const gender = ref(+route.query.gender === 0 ? 0 : +route.query.gender || -1)
const unitCode = ref(route.query.unitCode || '')

const getData = async () => {
  try {
    const response = await http.get(listApi.Employees, {
      params: {
        pageSize: pageSize.value,
        page: page.value,
        keyword: keyword.value,
        contactTitle: contactTitle.value,
        isActive: +isActive.value === -1 ? null : Boolean(isActive.value),
        gender: +gender.value === -1 ? null : Boolean(gender.value),
        unitCode: unitCode.value === '' ? null : unitCode.value,
      },
    })
    if (response.success) {
      rows.value = response.data.data
      totalItems.value = response.data.meta.total
    }
  } catch (error) {
    console.error('Error fetching employee list:', error)
    rows.value = []
    totalItems.value = 0
  }
}

const updateRouterQuery = () => {
  router.push({
    name: 'employee',
    query: {
      keyword: keyword.value,
      page: page.value,
      pageSize: pageSize.value,
      contactTitle: contactTitle.value,
      isActive: isActive.value,
      gender: gender.value,
      unitCode: unitCode.value,
    },
  })
}

const debounceGetData = debounce(() => {
  page.value = 1
  updateRouterQuery()
  getData()
}, 800)

const handleSelectedIds = (selectedIds) => {
  console.log('Selected rows:', selectedIds)
}

const handleFilter = (filter) => {
  contactTitle.value = filter.contactTitle
  isActive.value = filter.isActive
  gender.value = filter.gender
  unitCode.value = filter.unitCode
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
