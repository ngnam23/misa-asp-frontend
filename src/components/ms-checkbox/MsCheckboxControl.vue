<template>
  <div class="flex gap-x-2 items-center">
    <Checkbox v-model="value" :input-id="id || name" :name="name" binary />
    <label class="font-normal" :for="id || name">{{ label }}</label>
  </div>
</template>

<script setup>
import { Checkbox } from 'primevue'
import { useField } from 'vee-validate'
import { toRef } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: '',
  },
})

// Use field
const { value } = useField(toRef(props, 'name'))
</script>

<style scoped></style>
