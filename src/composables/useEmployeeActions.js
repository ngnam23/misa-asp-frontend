import { listApi } from '@/constants/list-api'
import http from '@/utils/http'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const confirmAcceptClass =
  '!h-[30px] !px-4 !text-white !text-[13px] !bg-primary hover:!bg-[#35bf22] !rounded-[3px] !border-transparent'
const confirmRejectClass =
  '!h-[30px] !px-4 !rounded-[3px] !text-[13px] !bg-white hover:!bg-[#d2d3d6] !border !border-[#8d9096] !text-111'

export const useEmployeeActions = (rows, selectedIdsArray, getData, handleOpenDialogToDouble) => {
  const confirm = useConfirm()
  const toast = useToast()

  const showToast = (severity, summary, detail) => {
    toast.add({ severity, summary, detail, life: 3000, position: 'top-center' })
  }

  const showConfirm = (message, onAccept) => {
    confirm.require({
      group: 'confirm-dialog',
      message,
      icon: 'icon-exclamation-warning',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      acceptClass: confirmAcceptClass,
      rejectClass: confirmRejectClass,
      accept: onAccept,
    })
  }

  const handleDeleteEmployee = async (ids) => {
    const idString = typeof ids === 'string' ? ids : ids.join(',')
    try {
      const response = await http.delete(listApi.Employees, { data: idString })
      if (response.success) {
        showToast('success', 'Thành công', 'Đã xóa thành công')
        getData()
      }
    } catch (error) {
      console.error('Error:', error)
      showToast('error', 'Lỗi', error.message || 'Đã xảy ra lỗi')
    }
  }

  const handleChangeStatusEmployee = async (status, ids) => {
    const idString = typeof ids === 'string' ? ids : ids.join(',')
    try {
      const response = await http.put(listApi.ChangeStatus, { status, ids: idString })
      if (response.success) {
        showToast('success', 'Thành công', 'Đã thay đổi trạng thái thành công')
        getData()
      }
    } catch (error) {
      console.error('Error:', error)
      showToast('error', 'Lỗi', error.message || 'Đã xảy ra lỗi')
    }
  }

  const handleActionAll = (action) => {
    const itemMap = new Map(rows.value.map((item) => [item.employeeID, item.employeeCode]))
    const labels = selectedIdsArray.value.map((id) => itemMap.get(id)).filter(Boolean)

    showConfirm(
      `Bạn có thực sự muốn ${action.label.toLowerCase()} Nhân viên <${labels.join(', ')}> không?`,
      () => {
        if (action.value === 'deleteAll') {
          handleDeleteEmployee(selectedIdsArray.value)
        } else if (action.value === 'activeAll') {
          handleChangeStatusEmployee(1, selectedIdsArray.value)
        } else if (action.value === 'unActiveAll') {
          handleChangeStatusEmployee(0, selectedIdsArray.value)
        }
      },
    )
  }

  const handleRowSelect = (option, row) => {
    if (option.value === 'delete') {
      showConfirm(`Bạn có thực sự muốn xóa Nhân viên <${row.employeeCode}> không?`, () => {
        handleDeleteEmployee([row.employeeID])
      })
    } else if (option.value === 'toggleStatus') {
      handleChangeStatusEmployee(row.isActive ? 0 : 1, [row.employeeID])
    } else if (option.value === 'double') {
      handleOpenDialogToDouble(row.employeeID)
    }
  }

  return {
    handleDeleteEmployee,
    handleChangeStatusEmployee,
    handleActionAll,
    handleRowSelect,
  }
}
