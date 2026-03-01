import { ref, onMounted, onUnmounted } from 'vue'

export function useDraggable(dialogRef) {
  const isDragging = ref(false)
  const position = ref({ x: 0, y: 0 })
  const dragOffset = ref({ x: 0, y: 0 })

  const handleMouseDown = (e) => {
    if (!dialogRef.value) return

    isDragging.value = true
    const rect = dialogRef.value.getBoundingClientRect()
    dragOffset.value = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging.value || !dialogRef.value) return

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const dialogWidth = dialogRef.value.offsetWidth
    const dialogHeight = dialogRef.value.offsetHeight

    let newX = e.clientX - dragOffset.value.x - viewportWidth / 2 + dialogWidth / 2
    let newY = e.clientY - dragOffset.value.y - viewportHeight / 2 + dialogHeight / 2

    // Allow dragging to 4 corners - only keep header (60px) visible
    const headerHeight = 60
    newX = Math.max(-dialogWidth + headerHeight, Math.min(newX, dialogWidth - headerHeight))
    newY = Math.max(-dialogHeight + headerHeight, Math.min(newY, dialogHeight - headerHeight))

    position.value = { x: newX, y: newY }
  }

  const handleMouseUp = () => {
    isDragging.value = false
  }

  onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    isDragging.value = false
  })

  return {
    position,
    handleMouseDown,
  }
}
