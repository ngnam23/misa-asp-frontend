<template>
  <div>
    <TheHeader />
    <div class="flex h-[calc(100vh-48px)]">
      <TheSidebar />
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import TheHeader from '@/layouts/TheHeader.vue'
import TheSidebar from '@/layouts/TheSidebar.vue'
</script>
