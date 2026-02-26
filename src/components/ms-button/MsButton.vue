<template>
  <div
    :class="[
      'flex justify-center items-center min-w-[58px] h-[30px] py-[6px] px-4 rounded-[3px] cursor-pointer',
      buttonClass,
    ]"
    @click="$emit('click')"
  >
    <span class="font-medium">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'primary',
  },
})

const emit = defineEmits(['click'])

const buttonClass = computed(() => {
  switch (props.type) {
    case 'primary':
      return 'bg-primary text-white hover:bg-[#35bf22]'
    case 'secondary':
      return 'border border-8d9 text-111 hover:bg-d2d3'
    default:
      return 'bg-primary text-white hover:bg-[#35bf22]'
  }
})
</script>
