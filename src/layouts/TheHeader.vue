<template>
  <div class="h-12 flex items-center">
    <div class="relative flex items-center w-[196px] h-full bg-primary pl-3">
      <div class="bg-new-year"></div>
      <div class="icon-switch-app mr-2.5"></div>
      <div class="h-8 w-fit cursor-pointer">
        <img src="@/assets/svgs/asp-logo-white.svg" alt="asp-logo-white" class="w-full h-full" />
      </div>
    </div>
    <div class="flex-1 flex items-center justify-between h-full navbar-wrapper">
      <div class="flex items-center gap-x-5">
        <div class="flex items-center gap-x-2">
          <div class="icon-three-stripes"></div>
          <div class="text-white text-[14px]">Fresher ASP - ASP TEST</div>
        </div>
        <div
          class="h-[30px] flex items-center gap-x-2 px-3 rounded-[40px] cursor-pointer bg-[rgba(239,239,239,.2)]"
        >
          <div class="w-2 h-2 rounded-full bg-85f"></div>
          <div class="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-white">
            LH159FSASP - ASPTEST
          </div>
        </div>
      </div>
      <div class="flex items-center gap-x-5 h-full">
        <div class="input-wrap">
          <input
            type="text"
            class="pl-2.5 pr-9 border-none outline-none w-full h-full bg-transparent"
            placeholder="Nhập từ khóa tìm kiếm"
          />
          <div class="icon-input-search absolute right-2.5 top-1/2 -translate-y-1/2"></div>
        </div>
        <div class="flex h-full">
          <div
            v-for="item in listNavbar"
            :key="item.label"
            class="flex items-center justify-center h-full hover:bg-ff3 cursor-pointer"
          >
            <div :class="[item.icon, 'mx-2.5']"></div>
          </div>
          <div class="flex items-center justify-center h-full hover:bg-ff3 cursor-pointer">
            <div
              class="flex items-center justify-center w-8 h-8 mx-2.5 rounded-full bg-31a text-white"
            >
              N
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const listNavbar = ref([
  {
    label: 'Tải tệp xuất khẩu hàng loạt',
    icon: 'icon-install-new',
  },
  {
    label: 'Tiện ích và thiết lập',
    icon: 'icon-setting-new',
  },
  {
    label: 'Thông báo',
    icon: 'icon-notification-new',
  },
  {
    label: 'Trợ giúp',
    icon: 'icon-question-new',
  },
  {
    label: 'Kiến thức hữu ích',
    icon: 'icon-knowledge-new',
  },
])
</script>

<style scoped lang="scss">
.navbar-wrapper {
  background: linear-gradient(to right, #2ca01c, #00c1bf);
}
.input-wrap {
  position: relative;
  border: 1px solid rgba(235, 237, 240, 0.8);
  border-radius: 3px;
  background: rgba(255, 255, 255, 0);
  color: #fffc;
  width: 200px;
  height: 28px;

  & input::placeholder {
    color: #fffc;
    font-size: 12px;
    font-style: italic;
  }
}
.bg-new-year {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/bg-head-new-year.webp');
  background-repeat: no-repeat;
}
</style>
