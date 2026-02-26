<template>
  <div class="w-[196px] h-full">
    <div class="flex justify-center mt-4 mx-3">
      <div
        class="flex justify-center items-center h-8 w-[90%] px-4 border-[2px] border-3b3c rounded-[30px] text-111 hover:bg-d2d3 cursor-pointer"
      >
        <div class="icon-plus-success"></div>
        <span class="text-[14px] pl-2.5">Thêm nhanh</span>
      </div>
    </div>
    <div class="h-[calc(100%-48px)] pt-[14px]">
      <div class="h-full overflow-y-scroll">
        <div class="h-[42px] relative">
          <div
            v-for="item in SIDEBAR_MENU"
            :key="item.name"
            :class="[
              'px-[14px] h-full mt-1 text-212 font-medium cursor-pointer flex items-center justify-between menu-item',
              item.icon === 'icon-menu' && 'active',
            ]"
          >
            <div class="flex items-center flex-1">
              <div
                class="icon-sidebar mr-2"
                :class="[item.icon, item.icon === 'icon-menu' && 'active']"
              ></div>
              <span class="text-212 font-normal">{{ item.name }}</span>
            </div>
            <div v-if="!item.isNoArrow" class="icon-arrow-right-small"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { SIDEBAR_MENU } from '@/constants/common'
</script>

<style scoped>
.menu-item {
  &:hover::before,
  &.active::before {
    content: '';
    width: calc(100% - 16px);
    height: 100%;
    border-radius: 8px;
    left: 8px;
    background: #eceef1;
    position: absolute;
    z-index: -1;
  }
}
</style>
