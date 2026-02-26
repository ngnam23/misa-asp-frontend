<template>
  <nav :class="['pagination', { 'pagination--disabled': disabled }]" aria-label="Pagination">
    <button
      class="pagination__btn pagination__btn--prev"
      :disabled="disabled || currentPage <= 1"
      @click="goToPage(currentPage - 1)"
    >
      Trước
    </button>

    <ul class="pagination__list">
      <li v-for="(item, index) in pageItems" :key="typeof item === 'number' ? item : item + index">
        <!-- Ellipsis -->
        <span v-if="typeof item === 'string'" class="pagination__ellipsis" aria-hidden="true">
          ...
        </span>
        <!-- Nút số trang -->
        <button
          v-else
          :class="['pagination__item', { 'pagination__item--active': item === currentPage }]"
          :disabled="disabled"
          :aria-current="item === currentPage ? 'page' : undefined"
          @click="goToPage(item)"
        >
          {{ item }}
        </button>
      </li>
    </ul>

    <button
      class="pagination__btn pagination__btn--next"
      :disabled="disabled || currentPage >= totalPages"
      @click="goToPage(currentPage + 1)"
    >
      Sau
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  siblingCount: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['update:modelValue'])

const currentPage = computed(() => props.modelValue)

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

const pageItems = computed(() => {
  const { siblingCount: siblings } = props
  const current = currentPage.value

  const totalSlots = siblings * 2 + 5
  if (totalPages.value <= totalSlots) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(current - siblings, 1)
  const rightSiblingIndex = Math.min(current + siblings, totalPages.value)

  const showLeftEllipsis = leftSiblingIndex > 2
  const showRightEllipsis = rightSiblingIndex < totalPages.value - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + 2 * siblings
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1)
    return [...leftRange, 'right-ellipsis', totalPages.value]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + 2 * siblings
    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => totalPages.value - rightCount + 1 + i,
    )
    return [1, 'left-ellipsis', ...rightRange]
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  )
  return [1, 'left-ellipsis', ...middleRange, 'right-ellipsis', totalPages.value]
})

function goToPage(page) {
  if (props.disabled) return
  if (page < 1 || page > props.totalPages) return
  emit('update:modelValue', page)
}
</script>

<style scoped>
.pagination {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  user-select: none;
}

.pagination--disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* ---------- Nút Trước / Sau ---------- */
.pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: #111111;
  font-size: 13px;
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.pagination__btn:disabled {
  color: #9e9e9e;
  cursor: not-allowed;
}

/* ---------- Danh sách trang ---------- */
.pagination__list {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #111111;
  font-size: 13px;
  letter-spacing: 1px;
  user-select: none;
}

/* ---------- Nút số trang ---------- */
.pagination__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 23px;
  height: 20px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #111111;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  transition:
    background-color 0.15s,
    border-color 0.15s;
}

.pagination__item--active {
  border-color: #e0e0e0;
  background-color: #fff;
  font-weight: 700;
  cursor: default;
  border-radius: 2px;
}

.pagination__item:disabled {
  color: #d1d5db;
  cursor: not-allowed;
}
</style>
