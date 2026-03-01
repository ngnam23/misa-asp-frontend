<script setup>
import { DatePicker } from 'primevue'
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
})

const { value, errorMessage, handleBlur } = useField(props.name)
</script>

<template>
  <div class="flex flex-col gap-y-1 w-full ms-input-date">
    <label v-if="label" class="text-xs font-semibold text-111">{{ label }}</label>

    <DatePicker
      v-model="value"
      showIcon
      fluid
      iconDisplay="input"
      dateFormat="dd/mm/yy"
      placeholder="dd/mm/yyyy"
      @blur="handleBlur"
      :class="[
        'h-[26px] !ext-[13px] outline-none font-normal w-full border border-bab bg-white rounded-[2px] focus:border-primary',
        errorMessage && '!border-[red] focus:border-[red]',
      ]"
    />

    <p v-if="errorMessage" class="text-[red] text-xs font-normal line-clamp-1">
      {{ errorMessage }}
    </p>
  </div>
</template>
