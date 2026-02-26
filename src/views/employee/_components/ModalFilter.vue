<template>
  <div ref="containerRef" class="batch-action-select">
    <button class="trigger" @click="toggle">
      <span>{{ label }}</span>
      <div :class="['icon-arrow-up-black chevron', isOpen && 'rotated']"></div>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown">
        <div>
          <div class="grid grid-cols-2 gap-2">
            <div class="col-span-1">
              <div class="flex flex-col">
                <div class="text-[12px] text-212">Tên đơn vị</div>
                <ms-table-select-search
                  v-model="unitCode"
                  :columns="[
                    { field: 'value', label: 'Mã đơn vị', width: '160px' },
                    { field: 'name', label: 'Tên đơn vị' },
                  ]"
                  :options="[
                    {
                      value: '7E2ECAC8-3E12-F111-A545-34CFF6887D3F',
                      name: 'Fresher ASP',
                    },
                  ]"
                  value-field="value"
                  display-field="name"
                  dropdown-width="358px"
                />
              </div>
            </div>
            <div class="col-span-1">
              <div class="flex flex-col">
                <div class="text-[12px] text-212">Chức danh</div>
                <input
                  v-model="contactTitle"
                  class="h-[26px] w-full border font-normal rounded-[2px] outline-none px-2.5 border-[#babec5]"
                />
              </div>
            </div>
            <div class="col-span-1">
              <div class="flex flex-col">
                <div class="text-[12px] text-212">Giới tính</div>
                <ms-select-search
                  v-model="gender"
                  :options="[
                    { value: -1, label: 'Tất cả' },
                    { value: 1, label: 'Nam' },
                    { value: 0, label: 'Nữ' },
                  ]"
                />
              </div>
            </div>
            <div class="col-span-1">
              <div class="flex flex-col">
                <div class="text-[12px] text-212">Trạng thái</div>
                <ms-select-search
                  v-model="isActive"
                  :options="[
                    { value: -1, label: 'Tất cả' },
                    { value: 1, label: 'Đang sử dụng' },
                    { value: 0, label: 'Ngừng sử dụng' },
                  ]"
                />
              </div>
            </div>
          </div>
          <div class="my-5 h-[1px] w-full bg-e0e"></div>
          <div class="flex justify-between">
            <ms-button label="Đặt lại" type="secondary" />
            <ms-button label="Lọc" @click="handleFilter" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MsSelectSearch from '@/components/ms-select/MsSelectSearch.vue'
import MsButton from '@/components/ms-button/MsButton.vue'
import MsTableSelectSearch from '@/components/ms-select/MsTableSelectSearch.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['filter'])

const isOpen = ref(false)
const containerRef = ref(null)

const contactTitle = ref(route.query.contactTitle || '')
const isActive = ref(+route.query.isActive === 0 ? 0 : +route.query.isActive || -1)
const gender = ref(+route.query.gender === 0 ? 0 : +route.query.gender || -1)
const unitCode = ref(route.query.unitCode || '')

function toggle() {
  isOpen.value = !isOpen.value
}

function handleClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

const handleFilter = () => {
  emit('filter', {
    isActive: isActive.value,
    gender: gender.value,
    unitCode: unitCode.value,
    contactTitle: contactTitle.value,
  })
  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.batch-action-select {
  position: relative;
  display: inline-block;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

.trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 16px;
  border: 2px solid #3b3c3f;
  border-radius: 30px;
  background-color: transparent;
  color: #111111;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.trigger:hover {
  background-color: #d2d3d6;
}

.trigger.disabled {
  color: #afafaf;
  cursor: default;
}
.trigger.disabled:hover {
  background-color: transparent;
}

.trigger.disabled .chevron {
  opacity: 30%;
  cursor: default;
}

.chevron {
  transition: transform 0.2s ease;
}
.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  z-index: 50;
  min-width: 400px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  /* overflow: hidden; */
  background: rgb(255, 255, 255);
  padding: 16px 20px 20px;
  border-radius: 2px;
  border: 1px solid #babec5;
}
</style>
