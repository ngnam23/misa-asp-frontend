<template>
  <div ref="containerRef" class="batch-action-select">
    <button
      ref="triggerRef"
      :class="['trigger', isOpen && 'border border-[#0075c0]']"
      @click="toggle"
    >
      <div :class="['icon-arrow-up-blue chevron']"></div>
    </button>

    <Teleport to="body">
      <Transition name="dropdown">
        <div v-if="isOpen" ref="dropdownRef" class="dropdown" :style="dropdownStyle">
          <ul>
            <li v-for="option in options" :key="option.value">
              <button class="option" @click="select(option)">
                {{ option.label }}
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select'])

const isOpen = ref(false)
const containerRef = ref(null)
const triggerRef = ref(null)
const dropdownRef = ref(null)
const dropdownStyle = ref({})

function toggle() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      nextTick(() => {
        updatePosition()
      })
    }
  }
}

function updatePosition() {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()

  // Vị trí mặc định với min-width 160px
  dropdownStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.right - 160}px`,
  }

  // Tính toán lại thực tế dựa trên width của dropdown sau khi render
  nextTick(() => {
    if (dropdownRef.value) {
      const dropdownRect = dropdownRef.value.getBoundingClientRect()
      dropdownStyle.value.left = `${rect.right - dropdownRect.width}px`
    }
  })
}

function select(option) {
  if (!props.disabled) {
    emit('select', option)
    isOpen.value = false
  }
}

function handleClickOutside(e) {
  const isClickInsideContainer = containerRef.value && containerRef.value.contains(e.target)
  const isClickInsideDropdown = dropdownRef.value && dropdownRef.value.contains(e.target)

  if (!isClickInsideContainer && !isClickInsideDropdown) {
    isOpen.value = false
  }
}

function handleScroll(e) {
  if (isOpen.value) {
    // Chỉ đóng dropdown nếu scroll ở bên ngoài nó
    const isScrollInsideDropdown = dropdownRef.value && dropdownRef.value.contains(e.target)
    if (!isScrollInsideDropdown) {
      isOpen.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true) // capture phase để bắt được mọi sư kiện scroll của con
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
})
</script>

<style scoped>
.batch-action-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  width: 18px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chevron {
  transition: transform 0.2s ease;
}
.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown {
  position: fixed;
  z-index: 999999;
  min-width: 110px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: rgb(255, 255, 255);
  padding: 2px 1px;
  border-radius: 2px;
  border: 1px solid #babec5;
}

.dropdown ul {
  list-style: none;
  margin: 0;
  padding: 4px 0;
}

.option {
  display: block;
  width: 100%;
  padding: 5px 10px;
  height: 28px;
  border: none;
  background: none;
  color: #111111;
  font-weight: 400;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s ease;
}

.option:hover {
  background: #f3f4f6;
  color: #2ca01c;
}

/* Transition */
.dropdown-enter-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dropdown-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.1s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
</style>
