<template>
  <div ref="containerRef" class="batch-action-select">
    <button class="trigger" :class="{ disabled }" @click="toggle">
      <span>{{ label }}</span>
      <div :class="['icon-arrow-up-black chevron', isOpen && 'rotated']"></div>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown">
        <ul>
          <li v-for="option in options" :key="option.value">
            <button class="option" @click="select(option)">
              {{ option.label }}
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['select'])

const isOpen = ref(false)
const containerRef = ref(null)

function toggle() {
  if (!props.disabled) isOpen.value = !isOpen.value
}

function select(option) {
  if (!props.disabled) {
    emit('select', option)
    isOpen.value = false
  }
}

function handleClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false
  }
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
  left: 0;
  top: calc(100% + 4px);
  z-index: 50;
  min-width: 160px;
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
