<template>
  <div class="flex flex-col gap-y-1 w-full relative" ref="selectRef">
    <label v-if="label" class="text-xs font-semibold text-111">{{ label }}</label>

    <div
      class="select-trigger"
      :class="{ '!border-[red]': errorMessage, open: isOpen, 'drop-up': dropUp }"
    >
      <input
        ref="inputRef"
        class="select-trigger-input"
        type="text"
        :value="displayValue"
        @focus="onInputFocus"
        @input="onSearchInput"
        @blur="handleBlur"
      />
      <div class="select-arrow" @click="toggleDropdown">
        <div :class="['icon-arrow-up-black icon', isOpen ? 'open' : '']"></div>
      </div>
    </div>

    <Transition :name="dropUp ? 'dropdown-up' : 'dropdown'">
      <div v-if="isOpen" ref="dropdownRef" class="select-dropdown" :class="{ 'drop-up': dropUp }">
        <ul class="select-options">
          <li
            v-for="option in filteredOptions"
            :key="option.value"
            class="select-option"
            :class="{ selected: option.value === value }"
            @click="selectOption(option.value)"
          >
            {{ option.label }}
          </li>
          <li v-if="filteredOptions.length === 0" class="select-option no-result">
            Không tìm thấy kết quả
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: String,
  options: {
    type: Array,
    default: () => [],
  },
})

const { value, errorMessage, handleBlur } = useField(() => props.name)

const isOpen = ref(false)
const dropUp = ref(false)
const selectRef = ref(null)
const dropdownRef = ref(null)
const inputRef = ref(null)
const searchText = ref('')
const isSearching = ref(false)

const selectedLabel = computed(() => {
  const found = props.options.find((opt) => opt.value === value.value)
  return found ? found.label : ''
})

const displayValue = computed(() => {
  if (isSearching.value) return searchText.value
  return selectedLabel.value
})

const filteredOptions = computed(() => {
  if (!isSearching.value || !searchText.value.trim()) {
    return props.options
  }
  const keyword = searchText.value.trim().toLowerCase()
  return props.options.filter((opt) => opt.label.toLowerCase().includes(keyword))
})

// When dropdown closes, reset search text to show selected label
watch(isOpen, (val) => {
  if (!val) {
    searchText.value = ''
    isSearching.value = false
  }
})

function calculatePosition() {
  if (!selectRef.value) return
  const triggerRect = selectRef.value.getBoundingClientRect()
  const dropdownHeight = dropdownRef.value?.scrollHeight ?? 260
  const spaceBelow = window.innerHeight - triggerRect.bottom
  const spaceAbove = triggerRect.top
  dropUp.value = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
}

function onInputFocus() {
  searchText.value = displayValue.value
  //   isSearching.value = true
  //   if (!isOpen.value) {
  //     isOpen.value = true
  //     nextTick(() => calculatePosition())
  //   }
}

function onSearchInput(e) {
  searchText.value = e.target.value
  isSearching.value = true
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

function selectOption(selectedValue) {
  value.value = selectedValue
  isSearching.value = false
  searchText.value = ''
  isOpen.value = false
  inputRef.value?.blur()
}

function handleClickOutside(e) {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
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
  color: #111111;
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

.select-arrow .icon.open {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  border: 1px solid #babec5;
  border-radius: 2px;
  max-height: 260px;
  overflow-y: auto;
  padding: 2px 0;
}

.select-dropdown.drop-up {
  top: auto;
  bottom: calc(100% + 2px);
}

.select-options {
  list-style: none;
  margin: 0;
  padding: 0;
}

.select-option {
  height: 26px;
  line-height: 26px;
  padding: 0 14px 0 10px;
  cursor: pointer;
  color: #111;
  transition:
    background-color 0.15s,
    border-color 0.15s;
}

.select-option:hover {
  background-color: #ebedf0;
  color: #2ca01c;
}

.select-option.selected {
  background-color: #2ca01c;
  color: #fff;
}

.select-option.no-result {
  color: #999;
  cursor: default;
  font-style: italic;
}

.select-option.no-result:hover {
  background-color: transparent;
  color: #999;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: bottom;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scaleY(1);
}
</style>
