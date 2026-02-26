<script setup>
import Toast from 'primevue/toast'
import ConfirmPopup from 'primevue/confirmpopup'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<template>
  <Toast />
  <ConfirmPopup group="popup" />
  <ConfirmDialog group="dialog" class="custom-dialog" />
  <RouterView />
</template>
