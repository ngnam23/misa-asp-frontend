<template>
  <div class="page-size-select" ref="selectRef">
    <button class="select-trigger" :class="{ open: isOpen, 'drop-up': dropUp }" type="button">
      <span class="select-trigger-text">{{ selectedLabel }}</span>
      <div class="select-arrow" @click="toggleDropdown">
        <div :class="['icon-arrow-up-black icon', isOpen ? 'open' : '']"></div>
      </div>
    </button>

    <Transition :name="dropUp ? 'dropdown-up' : 'dropdown'">
      <div v-if="isOpen" ref="dropdownRef" class="select-dropdown" :class="{ 'drop-up': dropUp }">
        <ul class="select-options">
          <li
            v-for="option in options"
            :key="option.value"
            class="select-option"
            :class="{ selected: option.value === modelValue }"
            @click="selectOption(option.value)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 20,
  },
  options: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropUp = ref(false)
const selectRef = ref(null)
const dropdownRef = ref(null)

const selectedLabel = computed(() => {
  const found = props.options.find((opt) => opt.value === props.modelValue)
  return found ? found.label : ''
})

function calculatePosition() {
  if (!selectRef.value) return
  const triggerRect = selectRef.value.getBoundingClientRect()
  const dropdownHeight = dropdownRef.value?.scrollHeight ?? 260
  const spaceBelow = window.innerHeight - triggerRect.bottom
  const spaceAbove = triggerRect.top
  dropUp.value = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => calculatePosition())
  }
}

function selectOption(value) {
  emit('update:modelValue', value)
  isOpen.value = false
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
.page-size-select {
  position: relative;
  display: inline-block;
  font-size: 13px;
  font-weight: normal;
  min-width: 200px;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 26px;
  padding-left: 10px;
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

.select-trigger-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
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
