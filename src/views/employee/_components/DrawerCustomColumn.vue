<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="isOpen" class="dialog-overlay" @click.self="handleClose">
        <div ref="dialogRef" class="dialog-container">
          <div class="flex flex-col h-full overflow-y-auto">
            <div class="flex justify-between py-2 px-4">
              <div class="text-[24px] font-bold">Tùy chỉnh giao diện</div>
              <div class="flex items-center gap-x-2">
                <div class="icon-help"></div>
                <div class="icon-close" @click="handleClose"></div>
              </div>
            </div>
            <div class="my-5 mx-4">
              <div class="flex justify-between items-center">
                <div class="input-wrap mr-2">
                  <input
                    type="text"
                    class="pl-2.5 pr-9 border border-[#babec5] focus:border-primary rounded-[3px] outline-none w-full h-full bg-transparent"
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                  <div class="icon-input-search absolute right-2.5 top-1/2 -translate-y-1/2"></div>
                </div>
                <div class="text-007 cursor-pointer">Sửa tên cột hiển thị và độ rộng</div>
              </div>
            </div>
            <div class="h-[calc(100%-178px)]">
              <div class="h-full p-4 pt-0">
                <div class="h-full overflow-y-auto">
                  <table class="ms-table">
                    <thead class="sticky top-0 left-0 right-0 z-30">
                      <tr>
                        <th class="w-10 h-8 border-b-[2px] border-c7 bg-ef1"></th>
                        <th class="w-10 h-8 border-b-[2px] border-c7 bg-ef1">
                          <div class="flex justify-center items-center">
                            <Checkbox
                              v-model="selectedAll"
                              binary
                              size="small"
                              @change="handleSelectAll"
                            />
                          </div>
                        </th>
                        <th
                          class="h-8 border-b-[2px] border-c7 pr-5 pl-2.5 bg-ef1 text-xs text-left"
                        >
                          Tên cột dữ liệu
                        </th>
                      </tr>
                    </thead>
                    <draggable v-model="listFields" tag="tbody" group="people" item-key="key">
                      <template #item="{ element }">
                        <tr class="hover:bg-[#f2f9ff]">
                          <td class="w-10 h-8 border-b border-c7"></td>
                          <td class="w-10 h-8 border-b border-c7">
                            <div class="flex justify-center items-center">
                              <Checkbox
                                v-model="selectedIds"
                                :value="element.key"
                                size="small"
                                @change="handleRowSelect"
                              />
                            </div>
                          </td>
                          <td
                            class="h-8 border-b border-c7 font-normal pr-5 pl-2.5 text-xs text-left"
                          >
                            {{ element.label }}
                          </td>
                        </tr>
                      </template>
                    </draggable>
                  </table>
                </div>
              </div>
            </div>

            <div class="py-3 px-4 border-t-[4px] border-[#f4f5f8]">
              <div class="flex justify-between items-center">
                <div
                  class="flex items-center justify-center cursor-pointer !h-[30px] !px-4 !rounded-[3px] !text-[13px] !bg-white hover:!bg-[#d2d3d6] !border !border-[#8d9096] !text-111"
                  @click="handleClose"
                >
                  Hủy
                </div>
                <div class="flex items-center gap-x-2">
                  <div
                    class="flex items-center justify-center cursor-pointer !h-[30px] !px-4 !rounded-[3px] !text-[13px] !bg-white hover:!bg-[#d2d3d6] !border !border-[#8d9096] !text-111"
                  >
                    Lấy mẫu ngầm định
                  </div>
                  <div
                    class="flex items-center justify-center cursor-pointer !h-[30px] !px-4 !text-white !text-[13px] !bg-primary hover:!bg-[#35bf22] !rounded-[3px] !border-transparent"
                    @click="handleSubmit"
                  >
                    Cất
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useEmployeeTable } from '@/composables/useEmployeeTable'
import { Checkbox } from 'primevue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const { fields, updateFields } = useEmployeeTable()

const listFields = ref([...fields.value])
const selectedAll = ref(true)
const selectedIds = ref([
  ...fields.value.filter((field) => field.display).map((field) => field.key),
])

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      listFields.value = [...fields.value]
      selectedIds.value = [
        ...fields.value.filter((field) => field.display).map((field) => field.key),
      ]
      selectedAll.value = selectedIds.value.length === listFields.value.length
    }
  },
)

const handleSelectAll = () => {
  if (selectedAll.value) {
    selectedIds.value = listFields.value.map((field) => field.key)
  } else {
    selectedIds.value = []
  }
}

const handleRowSelect = () => {
  selectedAll.value = selectedIds.value.length === listFields.value.length
}

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
}

const handleSubmit = () => {
  updateFields(
    listFields.value.map((field) => {
      return {
        ...field,
        display: selectedIds.value.includes(field.key),
      }
    }),
  )
  emit('close')
}
</script>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);

  z-index: 50;
}

.dialog-container {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: white;
  width: 600px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 51;
}
.input-wrap {
  position: relative;
  width: 200px;
  height: 26px;
  color: #111111;
  font-weight: 400;

  & input::placeholder {
    font-size: 12px;
    font-style: italic;
    font-weight: 400;
  }
}
.ms-table {
  position: relative;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  table-layout: fixed;
}
</style>
