import { listApi } from '@/constants/list-api'
import http from '@/utils/http'
import { ref } from 'vue'

/**
 * Composable quản lý trạng thái và hành động cho Dialog Nhân viên
 * @returns {Object} Các state và phương thức xử lý Dialog
 */
export const useEmployeeDialog = () => {
  const isOpenEmployeeDialog = ref(false)
  const employeeDetail = ref(null)
  const type = ref('create')
  const newCode = ref('')

  /**
   * Lấy mã nhân viên mới từ hệ thống
   * @returns {Promise<string>} Mã nhân viên mới
   */
  const getNewCode = async () => {
    try {
      const response = await http.get(listApi.NewCode)
      if (response.success) {
        return response.data
      }
    } catch {
      return ''
    }
  }

  /**
   * Lấy thông tin chi tiết của một nhân viên theo ID
   * @param {string} employeeID - ID của nhân viên cần lấy thông tin
   */
  const getEmployeeDetail = async (employeeID) => {
    try {
      const response = await http.get(`${listApi.Employees}/${employeeID}`)
      if (response.success) {
        employeeDetail.value = response.data
      }
    } catch {
      employeeDetail.value = null
    }
  }

  /**
   * Mở Dialog để tạo mới nhân viên (lấy mã mới và đặt type = 'create')
   */
  const handleOpenDialogCreate = async () => {
    newCode.value = await getNewCode()
    type.value = 'create'
    isOpenEmployeeDialog.value = true
  }

  /**
   * Mở Dialog để cập nhật thông tin nhân viên (lấy thông tin chi tiết và đặt type = 'update')
   * @param {string} employeeID - ID của nhân viên cần cập nhật
   */
  const handleOpenDialogToUpdate = async (employeeID) => {
    await getEmployeeDetail(employeeID)
    type.value = 'update'
    isOpenEmployeeDialog.value = true
  }

  /**
   * Mở Dialog để nhân bản nhân viên (lấy thông tin cũ, lấy mã mới và đặt type = 'double')
   * @param {string} employeeID - ID của nhân viên cần nhân bản
   */
  const handleOpenDialogToDouble = async (employeeID) => {
    await getEmployeeDetail(employeeID)
    newCode.value = await getNewCode()
    type.value = 'double'
    isOpenEmployeeDialog.value = true
  }

  /**
   * Xử lý sau khi lưu và muốn thêm tiếp (lấy mã mới và giữ trạng thái create)
   */
  const handleSaveAndAdd = async () => {
    newCode.value = await getNewCode()
    type.value = 'create'
  }

  const listGroupEmployees = ref([])
  const listAccountsPayables = ref([])
  const listAccountsReceivables = ref([])

  /**
   * Lấy dữ liệu các options từ server
   */
  const getMasterData = async () => {
    try {
      const response = await http.get(listApi.MasterData)
      if (response.success) {
        listGroupEmployees.value = response.data.groupEmployees
        listAccountsPayables.value = response.data.accountsPayables
        listAccountsReceivables.value = response.data.accountsReceivables
      }
    } catch (error) {
      console.error('Error fetching master data:', error)
    }
  }

  return {
    isOpenEmployeeDialog,
    employeeDetail,
    type,
    newCode,
    listGroupEmployees,
    listAccountsPayables,
    listAccountsReceivables,
    handleOpenDialogCreate,
    handleOpenDialogToUpdate,
    handleOpenDialogToDouble,
    handleSaveAndAdd,
    getMasterData,
  }
}
