<template>
  <table class="ms-table">
    <thead class="sticky top-0 left-0 right-0 z-30">
      <tr class="">
        <th class="!w-10 h-8 sticky left-0 z-20 bg-ef1 border-b border-r border-c7">
          <div class="flex justify-center items-center">
            <Checkbox v-model="selectedAll" binary size="small" @change="handleSelectAll" />
          </div>
        </th>
        <th
          v-for="field in fields"
          :key="field.key"
          class="text-xs bg-ef1 px-2.5 border-b border-r border-c7"
          :style="{ width: `${field.width}px`, textAlign: field.align || 'left' }"
        >
          <span class="!truncate">{{ field.label }}</span>
        </th>
        <th class="w-[120px] h-8 px-2.5 sticky right-0 z-20 bg-ef1 border-b border-l border-c7">
          <div class="flex items-center justify-end">Chức năng</div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.employeeID" class="relative">
        <td class="!w-10 h-9 sticky left-0 z-20 bg-white border-b border-r border-c7">
          <div class="flex justify-center items-center">
            <Checkbox
              v-model="selectedIds"
              :value="row.employeeID"
              size="small"
              @change="handleRowSelect"
            />
          </div>
        </td>
        <td
          v-for="field in fields"
          :key="field.key"
          class="px-2.5 font-normal bg-white border-b border-r border-c7"
          :style="{ width: `${field.width}px`, textAlign: field.align || 'left' }"
        >
          <template v-if="field.key === 'isActive'">
            <span class="!truncate line-clamp-1">{{
              row[field.key] ? 'Đang sử dụng' : 'Ngừng sử dụng'
            }}</span>
          </template>
          <template v-else-if="field.key === 'gender'">
            <span class="!truncate line-clamp-1">{{ row[field.key] ? 'Nam' : 'Nữ' }}</span>
          </template>
          <template v-else-if="field.key === 'isCustomer' || field.key === 'isSupplier'">
            <Checkbox :modelValue="row[field.key]" size="small" disabled binary />
          </template>
          <template v-else-if="field.key === 'createdDate' || field.key === 'modifiedDate'">
            <span class="!truncate line-clamp-1">{{
              row[field.key] ? formatDateTimeDDMMYYYYHHmm(row[field.key]) : ''
            }}</span>
          </template>
          <template v-else
            ><span class="!truncate line-clamp-1">{{
              field.type === 'date' ? formatDateDDMMYYYY(row[field.key]) : row[field.key]
            }}</span></template
          >
        </td>
        <td class="w-[120px] h-8 sticky bg-white right-0 z-20 border-b border-l border-c7">
          <slot name="action" :row="row"></slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import { formatDateDDMMYYYY, formatDateTimeDDMMYYYYHHmm } from '@/utils/formatter'

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  keyField: {
    type: String,
    default: 'id',
  },
})

const emit = defineEmits(['updateSelectedIds'])

const selectedIds = ref([])
const selectedAll = ref(true)

watch(
  () => props.rows,
  () => {
    selectedAll.value = false
    selectedIds.value = []
  },
  { deep: true },
)

const handleSelectAll = () => {
  if (selectedAll.value) {
    selectedIds.value = props.rows.map((row) => row[props.keyField])
  } else {
    selectedIds.value = []
  }
  emit('updateSelectedIds', selectedIds.value)
}

const handleRowSelect = () => {
  selectedAll.value = selectedIds.value.length === props.rows.length
  emit('updateSelectedIds', selectedIds.value)
}
</script>

<style scoped>
.ms-table {
  position: relative;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  table-layout: fixed;
}
tr:hover th {
  cursor: pointer;
}
tr:hover td {
  background-color: #f2f9ff;
}
</style>
