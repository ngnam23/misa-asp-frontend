<template>
  <div class="radio-container">
    <div class="radio-wrapper">
      <input
        type="radio"
        :id="id"
        :name="name"
        :value="value"
        :checked="isChecked"
        @change="handleChange"
        @blur="handleBlur"
        class="radio-input"
      />
      <label :for="id" class="radio-label">
        <span class="radio-custom"></span>
        <span v-if="label" class="radio-text">{{ label }}</span>
      </label>
    </div>
    <p v-if="errorMessage" class="text-[red] text-xs font-normal line-clamp-1">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
})

const { value: fieldValue, errorMessage, handleBlur, setValue } = useField(() => props.name)

const isChecked = computed(() => {
  return fieldValue.value === props.value
})

const handleChange = () => {
  setValue(props.value)
}
</script>

<style scoped>
.radio-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.radio-wrapper {
  display: flex;
  align-items: center;
}

.radio-input {
  display: none;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  user-select: none;
}

.radio-custom {
  position: relative;
  width: 18px;
  height: 18px;
  border: 1px solid #afafaf;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

/* Khi checked */
.radio-input:checked + .radio-label .radio-custom {
  border-color: #2ca01c;
}

/* Inner circle khi checked */
.radio-input:checked + .radio-label .radio-custom::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #2ca01c;
  border-radius: 50%;
}

/* Focus state */
.radio-input:focus + .radio-label .radio-custom {
  outline: 1px solid rgba(76, 175, 80, 0.3);
  outline-offset: 2px;
}

.radio-text {
  color: #111;
  font-size: 13px;
  font-weight: 400;
}
</style>
