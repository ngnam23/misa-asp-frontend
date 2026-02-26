<template>
  <div class="table-select" ref="selectRef">
    <!-- Trigger -->
    <div class="select-trigger" :class="{ open: isOpen, 'drop-up': dropUp }">
      <input
        ref="inputRef"
        class="select-trigger-input"
        type="text"
        :value="displayValue"
        @focus="onInputFocus"
        @input="onSearchInput"
      />
      <div class="select-arrow" @click="toggleDropdown">
        <div :class="['icon-arrow-up-black icon', isOpen ? 'open' : '']"></div>
      </div>
    </div>

    <!-- Dropdown -->
    <Transition :name="dropUp ? 'dropdown-up' : 'dropdown'">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="select-dropdown"
        :class="{ 'drop-up': dropUp }"
        :style="{ width: dropdownWidth }"
      >
        <!-- Table Header -->
        <div class="table-header">
          <div
            v-for="col in columns"
            :key="col.field"
            class="table-header-cell"
            :style="{
              width: col.width || 'auto',
              minWidth: col.minWidth || '80px',
              flex: col.width ? 'none' : '1',
            }"
          >
            {{ col.label }}
          </div>
        </div>

        <!-- Table Body -->
        <ul class="table-body">
          <li
            v-for="(option, index) in filteredOptions"
            :key="getOptionValue(option)"
            class="table-row"
            :class="{
              selected: getOptionValue(option) === modelValue,
              highlighted: index === highlightedIndex,
            }"
            @click="selectOption(option)"
            @mouseenter="highlightedIndex = index"
          >
            <div
              v-for="col in columns"
              :key="col.field"
              class="table-cell"
              :style="{
                width: col.width || 'auto',
                minWidth: col.minWidth || '80px',
                flex: col.width ? 'none' : '1',
              }"
              :title="getFieldValue(option, col.field)"
            >
              {{ getFieldValue(option, col.field) }}
            </div>
          </li>
          <li v-if="filteredOptions.length === 0" class="table-row no-result">
            <div class="table-cell empty-cell">Không có dữ liệu hiển thị.</div>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null,
  },
  columns: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
  valueField: {
    type: String,
    default: 'value',
  },
  displayField: {
    type: String,
    default: 'label',
  },
  dropdownWidth: {
    type: String,
    default: 'max-content',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const dropUp = ref(false)
const selectRef = ref(null)
const dropdownRef = ref(null)
const inputRef = ref(null)
const searchText = ref('')
const isSearching = ref(false)
const highlightedIndex = ref(-1)

// Helpers
function getOptionValue(option) {
  return option[props.valueField]
}

function getFieldValue(option, field) {
  return option[field] ?? ''
}

// Computed
const selectedOption = computed(() => {
  return props.options.find((opt) => getOptionValue(opt) === props.modelValue) || null
})

const displayValue = computed(() => {
  if (isSearching.value) return searchText.value
  return selectedOption.value ? selectedOption.value[props.displayField] : ''
})

const filteredOptions = computed(() => {
  if (!isSearching.value || !searchText.value.trim()) {
    return props.options
  }
  const keyword = searchText.value.trim().toLowerCase()
  return props.options.filter((opt) => {
    // Search across all column fields
    return props.columns.some((col) => {
      const val = getFieldValue(opt, col.field)
      return String(val).toLowerCase().includes(keyword)
    })
  })
})

// Watchers
watch(isOpen, (val) => {
  if (!val) {
    searchText.value = ''
    isSearching.value = false
    highlightedIndex.value = -1
  }
})

// Methods
function calculatePosition() {
  if (!selectRef.value) return
  const triggerRect = selectRef.value.getBoundingClientRect()
  const dropdownHeight = dropdownRef.value?.scrollHeight ?? 300
  const spaceBelow = window.innerHeight - triggerRect.bottom
  const spaceAbove = triggerRect.top
  dropUp.value = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
}

function onInputFocus() {
  searchText.value = displayValue.value
}

function onSearchInput(e) {
  searchText.value = e.target.value
  isSearching.value = true
  highlightedIndex.value = -1
  if (!isOpen.value) {
    isOpen.value = true
    nextTick(() => calculatePosition())
  }
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      calculatePosition()
      inputRef.value?.focus()
    })
  }
}

function selectOption(option) {
  const value = getOptionValue(option)
  emit('update:modelValue', value)
  emit('change', value, option)
  isSearching.value = false
  searchText.value = ''
  isOpen.value = false
  inputRef.value?.blur()
}

function handleKeydown(e) {
  if (!isOpen.value) {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      isOpen.value = true
      nextTick(() => calculatePosition())
      e.preventDefault()
    }
    return
  }

  const opts = filteredOptions.value
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value = (highlightedIndex.value + 1) % opts.length
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value = (highlightedIndex.value - 1 + opts.length) % opts.length
      break
    case 'Enter':
      e.preventDefault()
      if (highlightedIndex.value >= 0 && highlightedIndex.value < opts.length) {
        selectOption(opts[highlightedIndex.value])
      }
      break
    case 'Escape':
      isOpen.value = false
      inputRef.value?.blur()
      break
  }
}

function handleClickOutside(e) {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.table-select {
  position: relative;
  display: inline-block;
  font-size: 13px;
  font-weight: normal;
  width: 100%;
}

/* ===== Trigger ===== */
.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 26px;
  background-color: #fff;
  border: 1px solid #babec5;
  border-radius: 2px;
  cursor: pointer;
  color: #111;
  font-size: 13px;
  text-align: left;
  transition: border-color 0.2s;
}

.select-trigger.open {
  border-color: #2ca01c;
}

.select-trigger-input {
  flex: 1;
  height: 100%;
  width: 100%;
  padding: 0 8px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #111;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-trigger-input:focus {
  cursor: text;
}

.select-trigger-input::placeholder {
  color: #b0b0b0;
}

.select-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 100%;
  transition: transform 0.2s ease;
}

.select-arrow:hover {
  background-color: #e0e0e0;
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.arrow-icon.open {
  transform: rotate(180deg);
}

/* ===== Dropdown ===== */
.select-dropdown {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  z-index: 1000;
  background: #fff;
  border: 1px solid #babec5;
  border-radius: 2px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  min-width: 100%;
}

.select-dropdown.drop-up {
  top: auto;
  bottom: calc(100% + 2px);
}

/* ===== Table Header ===== */
.table-header {
  display: flex;
  align-items: center;
  background-color: #eeeff1;
  padding: 0;
  font-weight: 700;
  color: #212121;
  flex-shrink: 0;
  min-height: 26px;
}

.table-header-cell {
  padding: 0 10px;
  font-size: 12px;
  text-transform: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-header-cell:last-child {
  border-right: none;
}

/* ===== Table Body ===== */
.table-body {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.table-row {
  display: flex;
  align-items: center;
  min-height: 26px;
  cursor: pointer;
  transition: background-color 0.1s;
  margin: 2px 0;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover,
.table-row.highlighted {
  background-color: #eeeff1;
  color: #2ca01c;
}

.table-row.selected {
  background-color: #2ca01c;
  color: #fff;
}

.table-row.no-result {
  cursor: default;
  justify-content: center;
}

.table-row.no-result:hover {
  background-color: transparent;
}

.table-cell {
  padding: 0 10px;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-cell:last-child {
  border-right: none;
}

.empty-cell {
  width: 100%;
  text-align: center;
  color: #999;
  font-style: normal;
  padding: 10px;
  border-right: none;
}

/* ===== Transitions ===== */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.96);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scaleY(1);
}

.dropdown-up-enter-active,
.dropdown-up-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
  transform-origin: bottom;
}

.dropdown-up-enter-from,
.dropdown-up-leave-to {
  opacity: 0;
  transform: scaleY(0.96);
}

.dropdown-up-enter-to,
.dropdown-up-leave-from {
  opacity: 1;
  transform: scaleY(1);
}
</style>
