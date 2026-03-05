import { listApi } from '@/constants/list-api'
import http from '@/utils/http'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const confirmAcceptClass =
  '!h-[30px] !px-4 !text-white !text-[13px] !bg-primary hover:!bg-[#35bf22] !rounded-[3px] !border-transparent'
const confirmRejectClass =
  '!h-[30px] !px-4 !rounded-[3px] !text-[13px] !bg-white hover:!bg-[#d2d3d6] !border !border-[#8d9096] !text-111'

/**
 * Composable quản lý các hành động thao tác với dữ liệu nhân viên (xóa, đổi trạng thái, ...)
 * @param {Ref} rows - Danh sách các dòng dữ liệu hiện tại
 * @param {Ref} selectedIdsArray - Danh sách các ID đang được chọn
 * @param {Function} getData - Hàm để tải lại dữ liệu khi có thay đổi
 * @param {Function} handleOpenDialogToDouble - Hàm mở dialog nhân bản
 * @returns {Object} Các phương thức xử lý hành động
 */
export const useEmployeeActions = (rows, selectedIdsArray, getData, handleOpenDialogToDouble) => {
  const confirm = useConfirm()
  const toast = useToast()

  /**
   * Hiển thị thông báo (toast message) lên giao diện
   * @param {string} severity - Mức độ thông báo (success, error, info, ...)
   * @param {string} summary - Tiêu đề thông báo
   * @param {string} detail - Nội dung chi tiết thông báo
   */
  const showToast = (severity, summary, detail) => {
    toast.add({ severity, summary, detail, life: 3000, position: 'top-center' })
  }

  /**
   * Hiển thị hộp thoại xác nhận trước khi thực hiện hành động
   * @param {string} message - Nội dung câu hỏi xác nhận
   * @param {Function} onAccept - Hàm callback khi người dùng chọn 'Có'
   */
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

  /**
   * Gọi API xóa nhân viên theo danh sách ID
   * @param {string|Array} ids - ID hoặc mảng ID nhân viên cần xóa
   */
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

  /**
   * Gọi API thay đổi trạng thái (Sử dụng/Ngừng sử dụng) của nhân viên
   * @param {number} status - Trạng thái mới (1: Sử dụng, 0: Ngừng sử dụng)
   * @param {string|Array} ids - ID hoặc mảng ID nhân viên cần thay đổi
   */
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

  /**
   * Xử lý các hành động hàng loạt trên các nhân viên đã được chọn
   * @param {Object} action - Đối tượng hành động chứa label và giá trị (deleteAll, activeAll, ...)
   */
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

  /**
   * Xử lý hành động được chọn từ menu dropdown của từng dòng trong bảng
   * @param {Object} option - Tùy chọn hành động được chọn (delete, toggleStatus, double)
   * @param {Object} row - Dữ liệu của dòng nhân viên tương ứng
   */
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
