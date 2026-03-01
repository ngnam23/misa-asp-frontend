<script setup>
import { useField } from 'vee-validate'
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: String,
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'int', // 'int' or 'decimal'
  },
})

const { value, errorMessage, handleBlur: veeHandleBlur, meta } = useField(props.name)
const displayValue = ref('')

function formatString(val) {
  if (val === null || val === undefined || val === '') return ''
  val = String(val)
  const parts = val.split(',')
  let intPart = parts[0].replace(/\D/g, '')
  const decPart = parts.length > 1 ? parts[1].replace(/\D/g, '') : null

  if (intPart.length > 1) {
    intPart = intPart.replace(/^0+/, '')
    if (intPart === '') intPart = '0'
  }

  let formattedInt = intPart
    ? Number(intPart).toLocaleString('vi-VN')
    : val.includes(',')
      ? '0'
      : ''

  if (decPart !== null && props.type === 'decimal') {
    return formattedInt + ',' + decPart
  }
  return formattedInt
}

function parseToNumber(val) {
  if (val === null || val === undefined || val === '') return null
  const parts = String(val).split(',')
  let intPart = parts[0].replace(/\D/g, '')
  let decPart = parts.length > 1 && props.type === 'decimal' ? parts[1].replace(/\D/g, '') : ''
  if (!intPart && !decPart) return null
  const floatStr = `${intPart || '0'}.${decPart}`
  return parseFloat(floatStr)
}

watch(
  value,
  (newVal) => {
    if (newVal === null || newVal === undefined || newVal === '') {
      displayValue.value = ''
    } else {
      const currentParsed = parseToNumber(displayValue.value)
      if (currentParsed !== newVal) {
        let str = String(newVal)
        if (props.type === 'decimal') {
          str = str.replace('.', ',')
        }
        displayValue.value = formatString(str)
      }
    }
  },
  { immediate: true },
)

const handleBlur = (event) => {
  if (value.value === null || value.value === undefined || value.value === '') {
    value.value = meta.initialValue !== undefined ? meta.initialValue : 0
  }
  // Trim trailing comma if user left it there
  if (displayValue.value.endsWith(',')) {
    displayValue.value = displayValue.value.slice(0, -1)
  }
  veeHandleBlur(event)
}

const handleInput = (event) => {
  const selectionStart = event.target.selectionStart
  const oldLength = event.target.value.length

  let newVal = event.target.value
  if (props.type === 'int') {
    newVal = newVal.replace(/,/g, '')
  } else if (props.type === 'decimal') {
    const parts = newVal.split(',')
    if (parts.length > 2) {
      newVal = parts[0] + ',' + parts.slice(1).join('')
    }
  }

  const formatted = formatString(newVal)
  displayValue.value = formatted
  value.value = parseToNumber(formatted)

  nextTick(() => {
    if (event.target) {
      event.target.value = formatted
      const newLength = event.target.value.length
      const addedChars = newLength - oldLength
      const newCursorPos = Math.max(0, selectionStart + addedChars)
      event.target.setSelectionRange(newCursorPos, newCursorPos)
    }
  })
}

const handleKeydown = (event) => {
  if (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    ['Backspace', 'Tab', 'Delete', 'Escape', 'Enter'].includes(event.key) ||
    event.key.startsWith('Arrow')
  ) {
    return
  }

  if (props.type === 'decimal' && event.key === ',') {
    if (displayValue.value.includes(',')) {
      event.preventDefault()
    }
    return
  }

  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault()
  }
}
</script>

<template>
  <div class="flex flex-col gap-y-1 w-full">
    <label v-if="label" class="text-xs font-semibold text-111">{{ label }}</label>

    <input
      type="text"
      :value="displayValue"
      @input="handleInput"
      @keydown="handleKeydown"
      @blur="handleBlur"
      :placeholder="placeholder"
      :class="[
        'h-[26px] pl-3 pr-2.5 text-[13px] outline-none font-normal w-full border border-bab bg-white rounded-[2px] focus:border-primary text-right',
        errorMessage && '!border-[red] focus:border-[red]',
      ]"
    />

    <!-- <p v-if="errorMessage" class="text-[red] text-xs font-normal line-clamp-1">
      {{ errorMessage }}
    </p> -->
  </div>
</template>
