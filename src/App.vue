<script setup>
import Toast from 'primevue/toast'
import ConfirmPopup from 'primevue/confirmpopup'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<template>
  <Toast />
  <ConfirmPopup group="popup" />
  <ConfirmDialog group="confirm-dialog" class="custom-dialog">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="p-8 rounded-[3px] max-w-[444px]">
        <div class="flex gap-x-4 items-center">
          <div :class="message.icon"></div>
          <span class="flex-1 text-111 font-normal">{{ message.message }}</span>
        </div>
        <div class="mt-8 mb-5 w-full h-[1px] bg-[#b8bcc3]"></div>

        <div class="flex justify-between">
          <button @click="rejectCallback" :class="message.rejectClass">
            {{ message.rejectLabel }}
          </button>
          <button @click="acceptCallback" :class="message.acceptClass">
            {{ message.acceptLabel }}
          </button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <RouterView />
</template>
