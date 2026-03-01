<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="isOpen" class="dialog-overlay" @click.self="handleClose">
        <div
          ref="dialogRef"
          class="dialog-container"
          :style="{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }"
        >
          <!-- Dialog Header - Draggable -->
          <div class="dialog-header" @mousedown="handleMouseDown">
            <h2 class="dialog-title">{{ title }}</h2>
            <div class="ml-5 flex gap-x-5">
              <div class="flex gap-x-2 items-center">
                <Checkbox v-model="isCustomer" input-id="isCustomer" binary />
                <label class="font-normal" for="isCustomer">Là khách hàng</label>
              </div>
              <div class="flex gap-x-2 items-center">
                <Checkbox v-model="isSupplier" input-id="isSupplier" binary />
                <label class="font-normal" for="isSupplier">Là nhà cung cấp</label>
              </div>
            </div>
            <div class="dialog-actions">
              <div class="icon-help"></div>
              <div class="icon-close" @click="handleClose"></div>
            </div>
          </div>

          <!-- Dialog Content -->
          <div class="dialog-content">
            <div class="grid grid-cols-2 gap-x-6">
              <div class="flex flex-col w-full gap-y-3">
                <div class="grid grid-cols-5 gap-x-1.5">
                  <div class="col-span-2">
                    <MsInputControl label="Mã" name="employeeCode" />
                  </div>
                  <div class="col-span-3">
                    <MsInputControl label="Tên" name="employeeName" />
                  </div>
                </div>
                <div class="w-full">
                  <MsTableSelectSearchControl
                    label="Đơn vị"
                    name="unitID"
                    :columns="[
                      { field: 'value', label: 'Mã đơn vị', width: '160px' },
                      { field: 'name', label: 'Tên đơn vị' },
                    ]"
                    :options="[
                      {
                        unitID: 'ad5b0a4f-c713-f111-a546-34cff6887d3f',
                        value: '5vf4ayanbef8',
                        name: 'Fresher ASP',
                      },
                    ]"
                    value-field="unitID"
                    display-field="name"
                  />
                </div>
                <div class="w-full">
                  <MsInputControl label="Chức danh" name="contactTitle" />
                </div>
                <div v-if="isCustomer || isSupplier" class="w-full">
                  <MsTableSelectSearchControl
                    label="Nhóm khách hàng, nhà cung cấp"
                    name="groupCustomerSupplier"
                    :columns="[
                      { field: 'value', label: 'Mã nhóm KH, NCC', width: '160px' },
                      { field: 'name', label: 'Tên nhóm KH, NCC' },
                    ]"
                  />
                </div>
              </div>
              <div class="flex flex-col w-full gap-y-3">
                <div class="grid grid-cols-3 gap-x-1.5">
                  <div class="col-span-1">
                    <MsInputDateControl label="Ngày sinh" name="dateOfBirth" />
                  </div>
                  <div class="col-span-1">
                    <div class="flex flex-col gap-y-1 w-full">
                      <label class="text-xs font-semibold text-111">Giới tính</label>
                      <div class="flex items-center gap-x-4">
                        <MsRadioControl label="Nam" id="male" name="gender" :value="1" />
                        <MsRadioControl label="Nữ" id="female" name="gender" :value="0" />
                      </div>
                    </div>
                  </div>
                  <div class="col-span-1">
                    <MsInputControl label="Số hộ chiếu" name="passportNumber" />
                  </div>
                </div>
                <div class="grid grid-cols-5 gap-x-1.5">
                  <div class="col-span-3">
                    <MsInputControl label="Số CMND/CCCD" name="cccdNumber" />
                  </div>
                  <div class="col-span-2">
                    <MsInputDateControl label="Ngày cấp" name="dateOfIssuance" />
                  </div>
                </div>
                <div class="grid grid-cols-1">
                  <MsInputControl label="Nơi cấp" name="issuingAuthority" />
                </div>
                <div v-if="isCustomer || isSupplier" class="grid grid-cols-5 gap-x-1.5">
                  <div v-if="isCustomer" class="col-span-2">
                    <MsTableSelectSearchControl
                      label="TK công nợ phải thu"
                      name="accountsReceivable"
                      :columns="[
                        { field: 'value', label: 'Số tài khoản', width: '160px' },
                        { field: 'name', label: 'Tên tài khoản' },
                      ]"
                      :options="[
                        {
                          accountsReceivable: '35ADA107-3F12-F111-A545-34CFF6887D3F',
                          value: '131',
                          name: 'Phải thu của khách hàng',
                        },
                      ]"
                      value-field="accountsReceivable"
                      display-field="value"
                    />
                  </div>
                  <div v-if="isSupplier" class="col-span-2">
                    <MsTableSelectSearchControl
                      label="TK công nợ phải trả"
                      name="accountsPayable"
                      :columns="[
                        { field: 'value', label: 'Số tài khoản', width: '160px' },
                        { field: 'name', label: 'Tên tài khoản' },
                      ]"
                      :options="[
                        {
                          accountsPayable: '985C551C-3F12-F111-A545-34CFF6887D3F',
                          value: '331',
                          name: 'Phải trả cho người bán',
                        },
                      ]"
                      value-field="accountsPayable"
                      display-field="value"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <div class="flex items-end gap-x-0.5">
                <div
                  v-for="tab in tabs"
                  :key="tab.value"
                  @click="tabActive = tab.value"
                  class="h-[26px] flex items-center font-normal px-2 border border-b-0 border-c9cd rounded-tr-[2px] rounded-tl-[2px] cursor-pointer hover:text-primary"
                  :class="[tabActive === tab.value && '!h-8 bg-[#cce4f9]']"
                >
                  {{ tab.label }}
                </div>
              </div>
              <div class="relative border border-c9cd p-[1px] h-[194px] overflow-y-auto">
                <div v-show="tabActive === 1" class="m-3">
                  <div class="grid grid-cols-11 gap-x-2">
                    <div class="col-span-3">
                      <MsInputNumberControl label="Lương thỏa thuận" name="salaryNegotiable" />
                    </div>
                    <div class="col-span-2">
                      <MsInputNumberControl
                        label="Hệ số lương"
                        type="decimal"
                        name="salaryCoefficient"
                      />
                    </div>
                    <div class="col-span-4">
                      <MsInputNumberControl
                        label="Lương đóng bảo hiểm"
                        name="salarySubjectInsuranceContributions"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-11 gap-x-2 mt-3">
                    <div class="col-span-3">
                      <MsInputControl label="Mã số thuế" name="taxCode" />
                    </div>
                    <div class="col-span-6">
                      <MsSelectSearchControl
                        label="Loại hợp đồng"
                        name="loaiHopDong"
                        :options="[
                          {
                            value: 0,
                            label: 'Không cư trú',
                          },
                          {
                            value: 1,
                            label: 'Cư trú và không ký HĐLĐ/HĐLĐ dưới 3 tháng',
                          },
                          {
                            value: 2,
                            label: 'Cư trú và có HĐLĐ từ 3 tháng trở lên',
                          },
                        ]"
                      />
                    </div>
                    <div class="col-span-2">
                      <MsInputNumberControl label="Số người phụ thuộc" name="numberOfDependents" />
                    </div>
                  </div>
                </div>
                <div v-show="tabActive === 2" class="m-3">
                  <div>
                    <table class="ms-table">
                      <thead>
                        <tr class="flex w-full">
                          <th
                            class="h-[30px] border-r border-b-[2px] border-c7 w-[150px] bg-ef1 px-2.5 inline-flex items-center justify-start text-xs text-111"
                          >
                            Số tài khoản
                          </th>
                          <th
                            class="h-[30px] border-r border-b-[2px] border-c7 w-[200px] bg-ef1 px-2.5 inline-flex items-center justify-start text-xs text-111"
                          >
                            Tên ngân hàng
                          </th>
                          <th
                            class="h-[30px] border-r border-b-[2px] border-c7 w-[180px] bg-ef1 px-2.5 inline-flex items-center justify-start text-xs text-111"
                          >
                            Chi nhánh
                          </th>
                          <th
                            class="h-[30px] border-r border-b-[2px] border-c7 flex-1 bg-ef1 px-2.5 inline-flex items-center justify-start text-xs text-111"
                          >
                            Tỉnh/TP của ngân hàng
                          </th>
                          <th
                            class="h-[30px] w-[40px] border-b-[2px] border-c7 bg-ef1 px-2.5 inline-flex items-center justify-start text-xs text-111"
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="flex w-full">
                          <td
                            class="h-[34px] border-r border-b border-c7 w-[150px] bg-e5f px-2.5 inline-flex items-center justify-start text-xs text-111"
                          >
                            <MsInputControl name="bankNumber" />
                          </td>
                          <td
                            class="h-[34px] border-r border-b border-c7 w-[200px] bg-e5f px-2.5 inline-flex items-center justify-start text-xs text-111"
                          >
                            <MsInputControl name="bankName" />
                          </td>
                          <td
                            class="h-[34px] border-r border-b border-c7 w-[180px] bg-e5f px-2.5 inline-flex items-center justify-start text-xs text-111"
                          >
                            <MsInputControl name="bankAddress" />
                          </td>
                          <td
                            class="h-[34px] border-r border-b border-c7 flex-1 bg-e5f px-2.5 inline-flex items-center justify-start text-xs text-111"
                          >
                            <MsInputControl name="bankCity" />
                          </td>
                          <td
                            class="h-[34px] w-[40px] border-b border-c7 bg-e5f px-2.5 inline-flex items-center justify-center text-xs text-111"
                          >
                            <div class="icon-delete"></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-show="tabActive === 3" class="m-3">
                  <div class="w-full">
                    <MsInputControl name="address" label="Địa chỉ" />
                  </div>
                  <div class="grid grid-cols-11 gap-x-2 mt-3">
                    <div class="col-span-3">
                      <MsInputControl name="phoneNumber" label="ĐT di động" />
                    </div>
                    <div class="col-span-6">
                      <MsInputControl name="landlinePhone" label="ĐT cố định" />
                    </div>
                    <div class="col-span-2">
                      <MsInputControl name="email" label="Email" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full h-[1px] bg-[#e0e0e0] mt-8 mb-5 mx-8"></div>

          <!-- Dialog Footer -->
          <div class="dialog-footer">
            <div
              class="flex items-center justify-center cursor-pointer !h-[30px] !px-4 !rounded-[3px] !text-[13px] !bg-white hover:!bg-[#d2d3d6] !border !border-[#8d9096] !text-111"
              @click="handleClose"
            >
              {{ cancelText }}
            </div>
            <div class="flex items-center gap-x-2">
              <div
                class="flex items-center justify-center cursor-pointer !h-[30px] !px-4 !rounded-[3px] !text-[13px] !bg-white hover:!bg-[#d2d3d6] !border !border-[#8d9096] !text-111"
                @click="handleConfirm2"
              >
                {{ confirmText2 }}
              </div>
              <div
                class="flex items-center justify-center cursor-pointer !h-[30px] !px-4 !text-white !text-[13px] !bg-primary hover:!bg-[#35bf22] !rounded-[3px] !border-transparent"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import MsInputControl from '@/components/ms-input/MsInputControl.vue'
import { Checkbox } from 'primevue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import MsTableSelectSearchControl from '@/components/ms-select/MsTableSelectSearchControl.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import MsInputDateControl from '@/components/ms-input/MsInputDateControl.vue'
import MsRadioControl from '@/components/ms-radio/MsRadioControl.vue'
import MsInputNumberControl from '@/components/ms-input/MsInputNumberControl.vue'
import MsSelectSearchControl from '@/components/ms-select/MsSelectSearchControl.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Dialog',
  },
  cancelText: {
    type: String,
    default: 'Hủy',
  },
  confirmText: {
    type: String,
    default: 'Cất và Thêm',
  },
  confirmText2: {
    type: String,
    default: 'Cất',
  },
})

const emit = defineEmits(['close', 'confirm', 'confirm2'])

const isCustomer = ref(false)
const isSupplier = ref(false)

const { setValues, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: yup.object({
    employeeCode: yup.string().required('Mã nhân viên trống'),
    employeeName: yup.string().required('Tên nhân viên trống'),
    contactTitle: yup.string().nullable(),
    unitID: yup.string().required('Đơn vị trống').notOneOf([''], 'Đơn vị trống'),
    dateOfBirth: yup.date().nullable(),
    gender: yup.number().default(1),
    cccdNumber: yup.string().nullable(),
    dateOfIssuance: yup.date().nullable(),
    issuingAuthority: yup.string().nullable(),
    groupCustomerSupplier: yup.string().nullable(),
    accountsReceivable: yup.string().nullable(),
    accountsPayable: yup.string().nullable(),
    salaryNegotiable: yup.number().nullable(),
    salaryCoefficient: yup.number().nullable(),
    salarySubjectInsuranceContributions: yup.number().nullable(),
    loaiHopDong: yup.number().nullable(),
    numberOfDependents: yup.number().nullable(),
    bankNumber: yup.string().nullable(),
    bankName: yup.string().nullable(),
    bankAddress: yup.string().nullable(),
    bankCity: yup.string().nullable(),
    address: yup.string().nullable(),
    phoneNumber: yup.string().nullable(),
    landlinePhone: yup.string().nullable(),
    email: yup.string().nullable(),
  }),
  initialValues: {
    gender: 1,
    salaryNegotiable: 0,
    salaryCoefficient: 0.0,
    salarySubjectInsuranceContributions: 0,
    loaiHopDong: 0,
    numberOfDependents: 0,
  },
  keepValuesOnUnmount: true,
})

const dialogRef = ref(null)
const isDragging = ref(false)
const position = ref({ x: 0, y: 0 })
const dragOffset = ref({ x: 0, y: 0 })

const tabActive = ref(1)
const tabs = ref([
  {
    label: 'Thông tin tiền lương',
    value: 1,
  },
  {
    label: 'Thông tin ngân hàng',
    value: 2,
  },
  {
    label: 'Thông tin liên hệ',
    value: 3,
  },
])

watch(isCustomer, (newVal) => {
  if (newVal) {
    setFieldValue('accountsReceivable', '35ADA107-3F12-F111-A545-34CFF6887D3F')
  } else {
    setFieldValue('accountsReceivable', null)
  }
})

watch(isSupplier, (newVal) => {
  if (newVal) {
    setFieldValue('accountsPayable', '985C551C-3F12-F111-A545-34CFF6887D3F')
  } else {
    setFieldValue('accountsPayable', null)
  }
})

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

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleConfirm2 = handleSubmit((values) => {
  console.log('values', { ...values, isCustomer: isCustomer.value, isSupplier: isSupplier.value })
})

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  isDragging.value = false
})
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.dialog-container {
  background: white;
  width: 90%;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 51;
}

.dialog-header {
  position: relative;
  padding: 20px 12px 20px 32px;
  display: flex;
  align-items: center;
  cursor: move;
  user-select: none;
}

.dialog-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #111111;
}

.dialog-actions {
  position: absolute;
  top: 0;
  right: 0;
  padding: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.dialog-content {
  flex: 1;
  padding: 0 32px;
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  padding: 0 32px 20px;
}

/* Transition animations */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-active .dialog-container,
.dialog-leave-active .dialog-container {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog-container,
.dialog-leave-to .dialog-container {
  transform: scale(0.95);
  opacity: 0;
}
.ms-table {
  position: relative;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  table-layout: fixed;
}
</style>
